import Cryptr from "cryptr";
import { readFile } from "fs/promises";

export const decryptConfigData = async (password: string, encPath: string) => {
  const cryptr = new Cryptr(password);

  const file = await readFile(encPath, "utf8");

  const decryptedConfig = cryptr.decrypt(file);

  return JSON.parse(decryptedConfig);
};
