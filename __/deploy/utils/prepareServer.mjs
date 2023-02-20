import { NodeSSH } from "node-ssh";
import { coloredConsole } from "./index.mjs";

export const prepareServer = async ({ env, filename }) => {
  const ssh = new NodeSSH();

  coloredConsole("green", "Zu Server verbinden...");
  await ssh.connect({
    host: env.IP,
    username: env.USERNAME,
    port: env.PORT || "22",
    password: env.PASSWORD,
  });

  coloredConsole("green", "Server wird geupdated...");
  await ssh.execCommand(`apt-get update -y`, {
    cwd: "/",
    onStdout(chunk) {
      console.log(chunk.toString("utf8"));
    },
    onStderr(chunk) {
      coloredConsole("red", chunk.toString("utf8"));
    },
  });

  coloredConsole("green", "Docker Version prüfen und ggf. installieren...");
  await ssh.execCommand(
    `command -v docker || (curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose)`,
    {
      cwd: "/",
      onStdout(chunk) {
        console.log(chunk.toString("utf8"));
      },
      onStderr(chunk) {
        coloredConsole("red", chunk.toString("utf8"));
      },
    }
  );

  //VERZEICHNIS ERSTELLEN, FALLS DIESES NICHT EXISTIERT UM ERROR ZU VERMEIDEN
  await ssh.execCommand(`mkdir -p ${env.PATH || "/var/www/html/current/"}`, {
    cwd: "/",
    onStdout(chunk) {
      console.log(chunk.toString("utf8"));
    },
    onStderr(chunk) {
      coloredConsole("red", chunk.toString("utf8"));
      process.exit();
    },
  });

  //ALLE ORDNER LÖSCHEN IM ZIELVERZEICHNIS BIS AUF MONGO UND UPLOAD
  await ssh.execCommand(
    "rm -rf $(ls -A | grep -vE '(mongo)|(upload)|(logs)')",
    {
      cwd: env.PATH || "/var/www/html/current/",
      onStdout(chunk) {
        console.log(chunk.toString("utf8"));
      },
      onStderr(chunk) {
        coloredConsole("red", chunk.toString("utf8"));
        process.exit();
      },
    }
  );

  coloredConsole("green", "Artefakt wird übertragen...");
  await ssh
    .putFile(
      `./packages/deploy/artifacts/${filename}.tgz`,
      `${env.PATH || "/var/www/html/current/"}/artifact.tgz`
    )
    .then(
      function () {
        coloredConsole("green", "Erfolgreich übertragen.");
      },
      function (error) {
        coloredConsole("red", "Es ist ein Fehler aufgetreten.");
        coloredConsole("red", error);
        process.exit();
      }
    );

  coloredConsole("green", "Artefakt wird entpackt...");
  await ssh.execCommand(`tar -zxf artifact.tgz`, {
    cwd: env.PATH || "/var/www/html/current/",
    onStdout(chunk) {
      console.log(chunk.toString("utf8"));
    },
    onStderr(chunk) {
      coloredConsole("red", chunk.toString("utf8"));
      process.exit();
    },
  });

  coloredConsole("green", "Artefakte werden aufgeräumt...");

  await ssh.execCommand(`rm -rf artifact.tgz`, {
    cwd: env.PATH || "/var/www/html/current/",
    onStdout(chunk) {
      console.log(chunk.toString("utf8"));
    },
    onStderr(chunk) {
      coloredConsole("red", chunk.toString("utf8"));
      process.exit();
    },
  });
};
