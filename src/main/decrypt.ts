import Cryptr from "cryptr";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import {
  CONFIG_DEFAULT_NAME,
  ENC_CONFIG_DEFAULT_NAME,
  logger,
} from "../utils/internal/index.js";
import { writeFile, readFile } from "fs/promises";

export const runDecrypt = async (configName?: string) => {
  const cfgName = configName || CONFIG_DEFAULT_NAME;
  const configPath = path.resolve(process.cwd(), cfgName);

  const encCfgName =
    configName?.replace(".js", ".enc").replace(".ts", ".enc") ||
    ENC_CONFIG_DEFAULT_NAME;
  const encConfigPath = path.resolve(process.cwd(), encCfgName);

  if (!fs.existsSync(encConfigPath))
    throw new Error(`Config file "${encCfgName}" does not exist.`);
  if (fs.existsSync(configPath))
    throw new Error(`Config file "${cfgName}" already exists.`);

  const { password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      mask: "*",
      message:
        "Enter the password with which the server data is to be decrypted.",
    },
  ]);

  const cryptr = new Cryptr(password);

  const file = await readFile(encConfigPath, "utf8");

  const encryptedString = cryptr.decrypt(file);

  await writeFile(configPath, encryptedString);

  fs.unlinkSync(encConfigPath);

  logger.finished("The server data has been decrypted and can now be edited.");
};
