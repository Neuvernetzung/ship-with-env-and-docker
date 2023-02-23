import { NodeSSH } from "node-ssh";
import { Server } from "../../../types/config.js";
import { execCommand } from "./execCommand.js";
import { getTargetPath } from "./getTargetPath.js";

export const prepareServer = async (ssh: NodeSSH, deploy: Server) => {
  await execCommand(ssh, "apt-get update -y");

  await execCommand(ssh, "apt-get upgrade -y");

  await execCommand(
    ssh,
    `sudo sh -c 'if ! command -v docker >/dev/null; then (curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose); fi'`
  );

  await execCommand(ssh, `mkdir -p ${getTargetPath(deploy.server.path)}`);

  await execCommand(
    ssh,
    `find ${getTargetPath(deploy.server.path)} ${deploy.server.neverClean
      ?.map((path) => `! -name \"${path}\"`)
      .join(" ")} -delete`
  ); // rm -rf $(ls -A | grep -vE '(mongo)|(upload)|(logs)')
};
