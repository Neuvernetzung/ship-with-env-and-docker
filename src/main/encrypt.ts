import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import {
  CONFIG_DEFAULT_NAME,
  updateConfig,
  ENC_CONFIG_DEFAULT_NAME,
  getConfig,
  logger,
} from "../utils/internal/index.js";
import pick from "lodash/pick.js";
import Cryptr from "cryptr";
import omit from "lodash/omit.js";

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

  const { config } = await getConfig({
    config: configName,
    password: undefined,
  });

  const { methods, password, cfPassword } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "methods",
      choices: [
        { name: "production", checked: true },
        { name: "staging", checked: true },
        { name: "local" },
        { name: "dev" },
      ],
      message: "Please choose the methods you want to encrypt.",
    },
    {
      type: "password",
      name: "password",
      mask: "*",
      message:
        "Enter the password with which the server data is to be decrypted.",
    },
    {
      type: "password",
      name: "cfPassword",
      mask: "*",
      message: "Please confirm the password.",
    },
  ]);

  if (password !== cfPassword) {
    throw new Error(`The two passwords do not match.`);
  }

  const cryptr = new Cryptr(password);

  const configToEncrypt = JSON.stringify(pick(config, methods));

  const encryptedString = cryptr.encrypt(configToEncrypt);

  await writeFile(encConfigPath, encryptedString);

  const remainingConfig = omit(config, methods);
  await updateConfig(remainingConfig, { name: configName });

  logger.finished("The server data has been successfully encrypted.");
};
