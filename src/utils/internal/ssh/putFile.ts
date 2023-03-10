import { NodeSSH } from "node-ssh";

export const putFile = async (ssh: NodeSSH, file: string, target: string) =>
  await ssh.putFile(file, target).catch((error) => {
    throw new Error(
      `${error}\nAn error occured while transfering a file to Server.`
    );
  });
