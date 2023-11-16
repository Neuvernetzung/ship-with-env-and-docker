import { NodeSSH } from "node-ssh";
import { SSH_DEFAULT_PORT } from "./withSSHConnection";
import { ServerDetails } from "../../../types/deploys";

export const testSSH = async (server: ServerDetails) => {
  const ssh = await new NodeSSH()
    .connect({
      host: server.ip,
      username: server.ssh.user,
      port: server.ssh.port || SSH_DEFAULT_PORT,
      password: server.ssh.password,
    })
    .catch((error) => {
      throw new Error(
        `${error}\nThe SSH access with the IP address '${server.ip}' is not accessible.`
      );
    });

  ssh.dispose();
};
