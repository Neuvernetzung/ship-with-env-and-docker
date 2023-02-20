import { NodeSSH } from "node-ssh";
import { coloredConsole } from "./index.mjs";

export const activateRelease = async ({ env, command }) => {
  const ssh = new NodeSSH();

  coloredConsole("green", "Zu Server verbinden...");
  await ssh.connect({
    host: env.IP,
    username: env.USERNAME,
    port: env.PORT || "22",
    password: env.PASSWORD,
  });

  coloredConsole("green", "Release wird aktiviert...");
  await ssh.execCommand(command, {
    cwd: env.PATH || "/var/www/html/current/",
    onStdout(chunk) {
      console.log(chunk.toString("utf8"));
    },
    onStderr(chunk) {
      coloredConsole("red", chunk.toString("utf8"));
    },
  });

  coloredConsole("green", "Server wird bereinigt...");
  await ssh.execCommand("docker system prune -af --volumes", {
    cwd: env.PATH || "/var/www/html/current/",
    onStdout(chunk) {
      console.log(chunk.toString("utf8"));
    },
    onStderr(chunk) {
      coloredConsole("red", chunk.toString("utf8"));
    },
  });
};
