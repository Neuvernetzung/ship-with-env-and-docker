import { NodeSSH } from "node-ssh";
import { coloredConsole } from "./index.mjs";

export const sshHook = async ({ env }) => {
  const ssh = new NodeSSH();

  coloredConsole("green", "Zu Server verbinden...");
  await ssh.connect({
    host: env.IP,
    username: env.USERNAME,
    port: env.PORT || "22",
    password: env.PASSWORD,
  });

  coloredConsole("green", "Hook wird ausgeführt...");
  await ssh.execCommand(env.BEFORE_HOOK, {
    cwd: "/",
    onStdout(chunk) {
      console.log(chunk.toString("utf8"));
    },
    onStderr(chunk) {
      coloredConsole("red", chunk.toString("utf8"));
    },
  });
};
