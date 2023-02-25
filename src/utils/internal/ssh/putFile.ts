import { NodeSSH } from "node-ssh";
import { logger } from "../logger.js";

export const putFile = async (ssh: NodeSSH, file: string, target: string) =>
  await ssh.putFile(file, target).then(undefined, function (error) {
    logger.error("Es ist ein Fehler aufgetreten.");
    throw new Error(error);
  });
