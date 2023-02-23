import { NodeSSH } from "node-ssh";

export const putFile = async (ssh: NodeSSH, file: string, target: string) =>
  await ssh.putFile(file, target);
