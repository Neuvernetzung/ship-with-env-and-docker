import { NodeSSH } from "node-ssh";
import { Server } from "../../../types/index.js";
import { execCommand } from "./execCommand.js";
import { getTargetPath } from "./getTargetPath.js";

export const prepareServer = async (
  ssh: NodeSSH,
  deploy: Server,
  stdout?: NodeJS.WriteStream & NodeJS.WritableStream
) => {
  await execCommand(ssh, "apt-get update -y", { stdout });

  await execCommand(ssh, "apt-get upgrade -y", { stdout });

  await execCommand(ssh, "apt-get autoremove -y", { stdout }); // automatisch nicht weiter benötigte packages entfernen

  await execCommand(
    ssh,
    `sudo sh -c 'if ! command -v docker >/dev/null; then (curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose); fi'`,
    { stdout }
  );

  await execCommand(ssh, `mkdir -p ${getTargetPath(deploy.server.path)}`, {
    stdout,
  });

  const extendedNeverClean: string[] = [
    ...(deploy.server.neverClean || []),
    "logs",
  ];

  await execCommand(
    ssh,
    `rm -rf $(ls -A | grep -vE '${extendedNeverClean
      .map((v) => `(${v})`)
      .join("|")}')`,
    { stdout, cwd: getTargetPath(deploy.server.path) }
  );
};
