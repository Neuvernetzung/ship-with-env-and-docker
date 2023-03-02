import { NodeSSH } from "node-ssh";
import { ServerDetails } from "../../../types/index.js";

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
