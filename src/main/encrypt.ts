import fs from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import {
  CONFIG_DEFAULT_NAME,
  ENC_CONFIG_DEFAULT_NAME,
  logger,
} from "../utils/internal/index.js";
import Cryptr from "cryptr";

export const runEncrypt = async (configName?: string) => {
  const cfgName = configName || CONFIG_DEFAULT_NAME;
  const configPath = path.resolve(process.cwd(), cfgName);

  const encCfgName =
    configName?.replace(".js", ".enc").replace(".ts", ".enc") ||
    ENC_CONFIG_DEFAULT_NAME;
  const encConfigPath = path.resolve(process.cwd(), encCfgName);

  if (!fs.existsSync(configPath))
    throw new Error(`Config file "${cfgName}" does not exist.`);
  if (fs.existsSync(encConfigPath))
    throw new Error(`Config file "${encCfgName}" already exists.`);

  const { password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      mask: "*",
      message:
        "Enter the password with which the server data is to be decrypted.",
    },
  ]);
  const { password: cf_password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      mask: "*",
      message: "Please confirm the password.",
    },
  ]);
  if (password !== cf_password) {
    throw new Error(`The two passwords do not match.`);
  }

  const cryptr = new Cryptr(password);

  const file = await readFile(configPath, "utf8");

  const encryptedString = cryptr.encrypt(file);

  await writeFile(encConfigPath, encryptedString);

  fs.unlinkSync(configPath);

  logger.finished("The server data has been successfully encrypted.");
};
