import { NodeSSH } from "node-ssh";
import { ServerDetails } from "../../../types/index.js";

export const SSH_DEFAULT_PORT = 22;

export const withSSHConnection = async (
  server: ServerDetails,
  fn: (ssh: NodeSSH) => Promise<any>
) => {
  const ssh = new NodeSSH();

  await ssh.connect({
    host: server.ip,
    username: server.ssh.user,
    port: server.ssh.port || SSH_DEFAULT_PORT,
    password: server.ssh.password,
  });

  return await fn(ssh);
};
