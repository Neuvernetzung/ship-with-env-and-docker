import fs from "fs";
import crypto from "crypto";
import path from "path";
import zlib from "zlib";
import pMap from "p-map";
import {
  testConfig,
  coloredConsole,
  writeTar,
  prepareServer,
  sshHook,
  activateRelease,
  getCipherKey,
  streamToString,
  readInitVect,
  domainToAscii,
  getGitBranch,
  sleep,
  stripHttp,
} from "./utils/index.mjs";
import dotenv from "dotenv";
import { execSync } from "child_process";
import inquirer from "inquirer";
import waitOn from "wait-on";
import { generateSecretToken } from "./utils/generateSecretToken.mjs";

dotenv.config();

const deploy = async () => {
  //0 DEPLOYMENT CONFIG ENTSCHLÜSSELN
  const file = "deployment-config.json";
  let stage = false;

  if (process.argv.includes("--stage")) {
    //0-1 STAGING
    const { dest } = await inquirer.prompt([
      {
        type: "list",
        name: "dest",
        message:
          "Möchte Sie die Stagingumgebung Lokal oder auf einem Server starten?",
        choices: ["Lokal", "Server"],
      },
    ]);
    if (dest === "Lokal") {
      execSync("docker-compose -f docker-compose.test.yml up -V --build", {
        stdio: "inherit",
      });
    } else {
      stage = true;
    }
  }

  const REVALIDATION_SECRET = generateSecretToken(32);
  const ACCESS_TOKEN_SECRET = generateSecretToken(32);
  const REFRESH_TOKEN_SECRET = generateSecretToken(32);

  const { deploymentConfig } = await new Promise(async (resolve, reject) => {
    if (!stage) {
      // Prüfen ob in Git Master branch
      const branch = await getGitBranch();
      if (branch !== "master")
        return coloredConsole(
          "red",
          "Sie sind aktuell nicht im master Branch. Aus Sicherheitsgründen darf kein Deployment von Entwicklungszweigen ausgeführt werden."
        );

      if (!fs.existsSync(path.join(file + ".enc")))
        return coloredConsole(
          "red",
          `Die Datei ${path.join(file + ".enc")} existiert nicht.`
        );

      const { password } = await inquirer.prompt([
        {
          type: "password",
          name: "password",
          mask: "*",
          message:
            "Gib das Passwort ein, mit der die Serverdaten entschlüsselt werden sollen.",
        },
      ]);

      const initVect = await readInitVect({ file });

      const cipherKey = getCipherKey(password);
      const readStream = fs.createReadStream(path.join(file + ".enc"), {
        start: 16,
      });
      const decipher = crypto.createDecipheriv("aes256", cipherKey, initVect);
      const unzip = zlib.createUnzip();

      const deploymentConfig = JSON.parse(
        await streamToString(
          readStream
            .on("error", (e) => {
              return coloredConsole("red", "Das Passwort ist nicht korrekt.");
            })
            .pipe(decipher)
            .on("error", (e) => {
              return coloredConsole("red", "Das Passwort ist nicht korrekt.");
            })
            .pipe(unzip)
            .on("error", (e) => {
              return coloredConsole("red", "Das Passwort ist nicht korrekt.");
            })
        )
      );

      coloredConsole("magenta", "Passwort erfolgreich eingegeben.");
      resolve({ deploymentConfig });
    } else if (stage) {
      const stageFile = "stage-config.json";

      if (!fs.existsSync(path.join(stageFile)))
        return coloredConsole(
          "red",
          `Die Datei ${path.join(stageFile)} existiert nicht.`
        );

      const deploymentConfig = {
        "Staging Server Config": JSON.parse(fs.readFileSync(stageFile)),
      };
      resolve({ deploymentConfig });
    }
  });

  coloredConsole("magenta", "0 - Deployment gestartet");

  //1 CHECK FOR CORRECT DEPLOYMENT CONFIG
  coloredConsole("magenta", "1 - Deploymentconfig überprüfen");

  await testConfig(deploymentConfig);

  //2-1  BUILD BACKEND
  coloredConsole("magenta", "2-1 - Admin Artefakte erstellen");
  fs.rmSync("./apps/admin-panel/.next", { recursive: true, force: true });

  if (!fs.existsSync("./packages/deploy/artifacts")) {
    fs.mkdirSync("./packages/deploy/artifacts");
  }

  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      coloredConsole(
        "blue",
        `Admin Build für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      const env = deploymentConfig[name];

      fs.writeFileSync(
        "./config.env",
        `BASE_URL=${stripHttp(domainToAscii(env.BACKEND.URL))}\n
      ${env.CERT_BACKUP_EMAIL ? `CERTBOT_EMAIL=${env.CERT_BACKUP_EMAIL}` : ""}`
      );
      fs.writeFileSync(
        "./apps/admin-panel/.env",
        `BASE_URL=${domainToAscii(env.BACKEND.URL)}\n
      FRONTEND_URL=${domainToAscii(env.FRONTEND.URL)}\n
      IMG_URL=http://${env.BACKEND.IP}:8000\n
      MONGODB_URL=mongodb://${env.MONGO.USERNAME}:${
          env.MONGO.PASSWORD
        }@mongo:27017/\n
      ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}\n
      REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}\n
      REVALIDATION_SECRET=${REVALIDATION_SECRET}\n
      ${env.CERT_BACKUP_EMAIL ? `CERTBOT_EMAIL=${env.CERT_BACKUP_EMAIL}` : ""}\n
      ${stage && "ANALYZE=true"}`
      );
      fs.writeFileSync(
        "./mongo.env",
        `MONGO_INITDB_ROOT_USERNAME=${env.MONGO.USERNAME}\n
      MONGO_INITDB_ROOT_PASSWORD=${env.MONGO.PASSWORD}\n
      ME_CONFIG_MONGODB_ADMINUSERNAME=${env.MONGO.USERNAME}\n
      ME_CONFIG_MONGODB_ADMINPASSWORD=${env.MONGO.PASSWORD}\n
      ME_CONFIG_MONGODB_URL=mongodb://${env.MONGO.USERNAME}:${env.MONGO.PASSWORD}@mongo:27017/\n
      ME_CONFIG_BASICAUTH_USERNAME=${env.MONGO.USERNAME}\n
      ME_CONFIG_BASICAUTH_PASSWORD=${env.MONGO.PASSWORD}`
      );

      execSync("npm run build:admin", { stdio: "inherit" });

      await writeTar({
        name: `${name}_admin_artifact`,
        paths: [
          "apps/admin-panel/.next/",
          "apps/admin-panel/package.json",
          "apps/admin-panel/next.config.js",
          "apps/admin-panel/i18n.js",
          "apps/admin-panel/public/",
          "apps/admin-panel/.env",
          "apps/admin-panel/pages/", //Pages wird nur benötigt damit next-translate nicht aus errort.
          "packages",
          "config.env",
          "mongo.env",
          "package.json",
          "package-lock.json",
          "docker-compose.prod.backend.yml",
          "Dockerfile.admin.prod",
          "turbo.json",
          "certbot",
          "cron",
          "nginx",
        ],
      });

      await sleep(100);

      fs.rmSync("./apps/admin-panel/.next/", { recursive: true, force: true });
      fs.rmSync("./mongo.env", { force: true });
      fs.rmSync("./config.env", { force: true });
      fs.rmSync("./apps/admin-panel/.env", { force: true });
      coloredConsole(
        "blue",
        `Admin Build für ${name} abgeschlossen - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );
    },
    { concurrency: 1 }
  );

  //2-2 PREPARE BACKEND
  coloredConsole("magenta", "2-2 - Admin Server einrichten");
  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      coloredConsole(
        "blue",
        `Admin Server einrichten für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      await prepareServer({
        env: deploymentConfig[name].BACKEND,
        filename: `${name}_admin_artifact`,
      });

      fs.rmSync(`./packages/deploy/artifacts/${name}_admin_artifact.tgz`, {
        force: true,
      });

      coloredConsole(
        "blue",
        `Admin Server Einrichtung für ${name} abgeschlossen - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );
    },
    { concurrency: 1 }
  );

  //2-3 ADMIN BEFORE-HOOKS

  coloredConsole("magenta", "2-3 - Admin Server before-hooks ausführen");
  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      if (!deploymentConfig[name].BACKEND.BEFORE_HOOK) return;
      coloredConsole(
        "blue",
        `Admin Server before-hooks ausführen für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      await sshHook({
        env: deploymentConfig[name].BACKEND,
      });

      coloredConsole(
        "blue",
        `Admin Server before-hooks ausführen für ${name} abgeschlossen - ${
          i + 1
        }/${Object.keys(deploymentConfig).length}`
      );
    },
    { concurrency: 1 }
  );

  //2-4 START BACKEND

  coloredConsole("magenta", "2-4 - Admin Panel starten");
  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      coloredConsole(
        "blue",
        `Admin Panel starten für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      await activateRelease({
        env: deploymentConfig[name].BACKEND,
        command:
          "docker-compose -f docker-compose.prod.backend.yml up -V --build -d",
      });

      coloredConsole(
        "blue",
        `Admin Panel für ${name} gestartet - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );
    },
    { concurrency: 1 }
  );

  //2-5 ADMIN AFTER-HOOKS

  coloredConsole("magenta", "2-5 - Admin Server after-hooks ausführen");
  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      if (!deploymentConfig[name].BACKEND.AFTER_HOOK) return;
      coloredConsole(
        "blue",
        `Admin Server after-hooks ausführen für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      await sshHook({
        env: deploymentConfig[name].BACKEND,
      });

      coloredConsole(
        "blue",
        `Admin Server after-hooks ausführen für ${name} abgeschlossen - ${
          i + 1
        }/${Object.keys(deploymentConfig).length}`
      );
    },
    { concurrency: 1 }
  );

  //3-1  BUILD FRONTEND
  coloredConsole("magenta", "3-1 - Store Artefakte erstellen");
  fs.rmSync("./apps/store-front/.next", { recursive: true, force: true });

  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      coloredConsole(
        "blue",
        `Store Build für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      const env = deploymentConfig[name];

      //Auf Admin Panel warten
      await waitOn({
        resources: [domainToAscii(env.BACKEND.URL)],
        log: true,
        strictSSL: true,
      });

      fs.writeFileSync(
        "./config.env",
        `BASE_URL=${stripHttp(domainToAscii(env.FRONTEND.URL))}\n
        ${
          env.CERT_BACKUP_EMAIL ? `CERTBOT_EMAIL=${env.CERT_BACKUP_EMAIL}` : ""
        }`
      );
      fs.writeFileSync(
        "./apps/store-front/.env",
        `BASE_URL=${domainToAscii(env.FRONTEND.URL)}\n
        BACKEND_URL=${domainToAscii(env.BACKEND.URL)}\n
        BACKEND_PATH=/api/store\n
        IMG_URL=http://${env.BACKEND.IP}:8000\n
        REVALIDATION_SECRET=${REVALIDATION_SECRET}\n
        ${
          env.CERT_BACKUP_EMAIL ? `CERTBOT_EMAIL=${env.CERT_BACKUP_EMAIL}` : ""
        }\n${stage && "ANALYZE=true"}`
      );

      execSync("npm run build:store", { stdio: "inherit" });

      await writeTar({
        name: `${name}_store_artifact`,
        paths: [
          "apps/store-front/.next/",
          "apps/store-front/package.json",
          "apps/store-front/next.config.js",
          "apps/store-front/i18n.js",
          "apps/store-front/public/",
          "apps/store-front/.env",
          "apps/store-front/pages/", //Pages wird nur benötigt damit next-translate nicht aus errort.
          "packages",
          "config.env",
          "package.json",
          "package-lock.json",
          "docker-compose.prod.frontend.yml",
          "Dockerfile.store.prod",
          "turbo.json",
          "certbot",
          "cron",
          "nginx",
        ],
      });

      await sleep(100);

      fs.rmSync("./apps/store-front/.next/", { recursive: true, force: true });
      fs.rmSync("./config.env", { force: true });
      fs.rmSync("./apps/store-front/.env", { force: true });
      coloredConsole(
        "blue",
        `Store Build für ${name} abgeschlossen - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );
    },
    { concurrency: 1 }
  );

  //3-2 PREPARE FRONTEND
  coloredConsole("magenta", "3-2 - Store Server einrichten");
  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      coloredConsole(
        "blue",
        `Store Server einrichten für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      await prepareServer({
        env: deploymentConfig[name].FRONTEND,
        filename: `${name}_store_artifact`,
      });

      fs.rmSync(`./packages/deploy/artifacts/${name}_store_artifact.tgz`);

      coloredConsole(
        "blue",
        `Store Server Einrichtung für ${name} abgeschlossen - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );
    },
    { concurrency: 1 }
  );

  //3-3 STORE BEFORE-HOOKS

  coloredConsole("magenta", "3-3 - Store Server before-hooks ausführen");
  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      if (!deploymentConfig[name].FRONTEND.BEFORE_HOOK) return;
      coloredConsole(
        "blue",
        `Store Server before-hooks ausführen für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      await sshHook({
        env: deploymentConfig[name].FRONTEND,
      });

      coloredConsole(
        "blue",
        `Store Server before-hooks ausführen für ${name} abgeschlossen - ${
          i + 1
        }/${Object.keys(deploymentConfig).length}`
      );
    },
    { concurrency: 1 }
  );

  //3-4 START FRONTEND

  coloredConsole("magenta", "3-4 - Store starten");
  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      coloredConsole(
        "blue",
        `Store starten für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      await activateRelease({
        env: deploymentConfig[name].FRONTEND,
        command:
          "docker-compose -f docker-compose.prod.frontend.yml up -V --build -d",
      });

      coloredConsole(
        "blue",
        `Store für ${name} gestartet - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );
    },
    { concurrency: 1 }
  );

  //3-5 STORE AFTER-HOOKS

  coloredConsole("magenta", "3-5 - Store Server after-hooks ausführen");
  await pMap(
    Object.keys(deploymentConfig),
    async (name, i) => {
      if (!deploymentConfig[name].FRONTEND.AFTER_HOOK) return;
      coloredConsole(
        "blue",
        `Store Server after-hooks ausführen für ${name} - ${i + 1}/${
          Object.keys(deploymentConfig).length
        }`
      );

      await sshHook({
        env: deploymentConfig[name].FRONTEND,
      });

      coloredConsole(
        "blue",
        `Store Server after-hooks ausführen für ${name} abgeschlossen - ${
          i + 1
        }/${Object.keys(deploymentConfig).length}`
      );
    },
    { concurrency: 1 }
  );

  // 4 CLEAN UP DESKTOP
  coloredConsole("magenta", "4 - Artefakte bereinigen");
  fs.rmdirSync("./packages/deploy/artifacts", { recursive: true });

  coloredConsole(
    "magenta",
    "Deployment abgeschlossen. Die Server sollten nun online sein."
  );
  process.exit();
};

deploy();
