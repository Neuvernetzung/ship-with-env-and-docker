import { coloredConsole, stripHttp } from "./index.mjs";
import dnsPromises from "dns/promises";
import { NodeSSH } from "node-ssh";

const config = [
  {
    BACKEND: ["IP", "USERNAME", "PASSWORD", "PORT", "URL"],
  },

  {
    FRONTEND: ["IP", "USERNAME", "PASSWORD", "PORT", "URL"],
  },

  { MONGO: ["USERNAME", "PASSWORD"] },
];

const testVariable = ({ name, object, item, sub }) => {
  if (!object[item])
    return (
      coloredConsole(
        "red",
        "Bitte legen Sie die Variable " +
          (sub ? sub + " > " : "") +
          item +
          (name ? " bei " + name : "") +
          " fest."
      ),
      process.exit(1)
    );
};

const testDns = async ({ ip, domain, type, name }) => {
  await dnsPromises.lookup(ip).catch((error) => {
    return (
      coloredConsole(
        "red",
        `Die ${
          type === "backend" ? "Backend" : type === "frontend" ? "Frontend" : ""
        } IP Adresse (${ip}) von '${name}' ist nicht erreichbar.`
      ),
      process.exit(1)
    );
  });
  const aResult = await dnsPromises.resolve4(domain).catch((error) => {
    return (
      coloredConsole(
        "red",
        `Die ${
          type === "backend" ? "BACKEND" : type === "frontend" ? "FRONTEND" : ""
        } DOMAIN (${domain}) von '${name}' ist nicht erreichbar. Bitte erstellen Sie einen DOMAIN Record vom Typ 'A' mit dem Hostname '${
          domain.split(".").length <= 2 ? "@" : domain.split(".")[0]
        }' zeigend auf die IP Adresse: '${ip}'`
      ),
      process.exit(1)
    );
  });
  if (!aResult) return;
  if (!aResult?.includes(ip))
    return (
      coloredConsole(
        "red",
        `Die ${
          type === "backend" ? "BACKEND" : type === "frontend" ? "FRONTEND" : ""
        } DOMAIN (${domain}) von '${name}' zeigt auf eine andere IP Adresse. Bitte stellen Sie sicher, dass die DOMAIN auf die IP '${ip}' zeigt.`
      ),
      process.exit(1)
    );

  const wwwResult = await dnsPromises
    .resolve4("www." + domain)
    .catch((error) => {
      return (
        coloredConsole(
          "red",
          `Die ${
            type === "backend"
              ? "BACKEND"
              : type === "frontend"
              ? "FRONTEND"
              : ""
          } DOMAIN (www.${domain}) von '${name}' ist nicht erreichbar. Bitte erstellen Sie einen DOMAIN Record vom Typ 'A' mit dem Hostname '${
            domain.split(".").length <= 2
              ? "www"
              : "www." + domain.split(".")[0]
          }' zeigend auf die DOMAIN: '${domain}'`
        ),
        process.exit(1)
      );
    });
  if (!wwwResult) return;
  if (!wwwResult?.includes(ip))
    return (
      coloredConsole(
        "red",
        `Die ${
          type === "backend" ? "BACKEND" : type === "frontend" ? "FRONTEND" : ""
        } Weiterleitung (www.${domain}) von '${name}' zeigt auf eine andere DOMAIN. Bitte stellen Sie sicher, dass die Weiterleitung auf die DOMAIN '${domain}' zeigt.`
      ),
      process.exit(1)
    );

  const caaResult = await dnsPromises.resolveCaa(domain).catch((error) => {
    return (
      coloredConsole(
        "red",
        `Die ${
          type === "backend" ? "BACKEND" : type === "frontend" ? "FRONTEND" : ""
        } DOMAIN ZERTIFIZIERUNG (${domain}) von '${name}' ist nicht erreichbar. Bitte erstellen Sie einen DOMAIN Record vom Typ 'CAA' mit dem Hostname '${
          domain.split(".").length <= 2 ? "@" : domain.split(".")[0]
        }' zeigend auf die Wert: 'letsencrypt.org'`
      ),
      process.exit(1)
    );
  });
  if (!caaResult) return;
  if (![...caaResult]?.map((i) => i.issue).includes("letsencrypt.org"))
    return (
      coloredConsole(
        "red",
        `Die ${
          type === "backend" ? "BACKEND" : type === "frontend" ? "FRONTEND" : ""
        } DOMAIN ZERTIFIZIERUNG (${domain}) von '${name}' zeigt auf eine andere Zertifizierungsstelle. Bitte stellen Sie sicher, dass die Zertifizierung auf den Wert 'letsencrypt.org' zeigt.`
      ),
      process.exit(1)
    );
};

export const testConfig = async (deploymentConfig) => {
  await Promise.all(
    Object.keys(deploymentConfig).map(async (shopConfig) => {
      const env = deploymentConfig[shopConfig];

      config.map((item) => {
        if (typeof item === "string")
          testVariable({
            name: shopConfig,
            object: env,
            item,
          });
        if (typeof item === "object") {
          Object.keys(item).map((sub) => {
            testVariable({
              name: shopConfig,
              object: env,
              item: sub,
            });
            item[sub].map((_item) => {
              testVariable({
                name: shopConfig,
                object: env[sub],
                item: _item,
                sub,
              });
            });
          });
        }
      });
      await testDns({
        ip: env.BACKEND.IP,
        domain: stripHttp(env.BACKEND.URL),
        type: "backend",
        name: shopConfig,
      });
      await testDns({
        ip: env.FRONTEND.IP,
        domain: stripHttp(env.FRONTEND.URL),
        type: "frontend",
        name: shopConfig,
      });

      const frontend_ssh = new NodeSSH();
      await frontend_ssh
        .connect({
          host: env.FRONTEND.IP,
          username: env.FRONTEND.USERNAME,
          port: env.FRONTEND.PORT || "22",
          password: env.FRONTEND.PASSWORD,
        })
        .catch((error) => {
          return (
            coloredConsole(
              "red",
              `Der Frontend SSH Zugang mit der IP Adresse (${env.FRONTEND.IP}) von '${shopConfig}' ist nicht erreichbar.`
            ),
            process.exit(1)
          );
        });

      const backend_ssh = new NodeSSH();
      await backend_ssh
        .connect({
          host: env.BACKEND.IP,
          username: env.BACKEND.USERNAME,
          port: env.BACKEND.PORT || "22",
          password: env.BACKEND.PASSWORD,
        })
        .catch((error) => {
          return (
            coloredConsole(
              "red",
              `Der Backend SSH Zugang mit der IP Adresse (${env.BACKEND.IP}) von '${shopConfig}' ist nicht erreichbar.`
            ),
            process.exit(1)
          );
        });
    })
  );
};
