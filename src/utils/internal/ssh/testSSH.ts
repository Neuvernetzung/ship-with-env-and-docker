import { ServerDetails } from "../../../types/server.js";
import { NodeSSH } from "node-ssh";
import { logger } from "../index.js";
import { SSH_DEFAULT_PORT } from "./withSSHConnection.js";

export const testSSH = async (server: ServerDetails) => {
  await new NodeSSH()
    .connect({
      host: server.ip,
      username: server.ssh.user,
      port: server.ssh.port || SSH_DEFAULT_PORT,
      password: server.ssh.password,
    })
    .catch((error) => {
      logger.error(error);
      throw new Error(
        `The SSH access with the IP address '${server.ip}' is not accessible.`
      );
    });
};
