import { NodeSSH } from "node-ssh";
import { Server, ServerDetails } from "../../../types/config.js";

export const withSSHConnection = async (
  server: ServerDetails,
  fn: (ssh: NodeSSH) => Promise<void>
) => {
  const ssh = new NodeSSH();

  await ssh.connect({
    host: server.ip,
    username: server.ssh.user,
    port: server.ssh.port || "22",
    password: server.ssh.password,
  });

  await fn(ssh);

  ssh.dispose();
};
