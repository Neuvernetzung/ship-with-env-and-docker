import fs from "fs";

import path from "path";
import inquirer from "inquirer";
import {
  CONFIG_DEFAULT_NAME,
  updateConfig,
  getConfig,
  logger,
  exit,
} from "../utils/internal/index.js";
import pick from "lodash/pick.js";
import Cryptr from "cryptr";
import set from "lodash/set.js";
import { separateEncryptionData } from "../utils/internal/encryption/separateEncryptionData.js";
import merge from "lodash/merge.js";
import { SweadConfig } from "../index.js";
import isEmpty from "lodash/isEmpty.js";
import { bundleRequire } from "bundle-require";

export const runEncrypt = async (configName?: string) => {
  const cfgName = configName || CONFIG_DEFAULT_NAME;
  const configPath = path.resolve(process.cwd(), cfgName);

  logger.start("Swead encrypt started.");

  if (!fs.existsSync(configPath))
    throw new Error(`Config file "${cfgName}" does not exist.`);

  const { mod } = await bundleRequire({
    filepath: configPath,
  });
  if (mod?.config?.encrypted)
    throw new Error("Config is already encrypted. Please decrypt before.");

  const { config } = await getConfig({
    config: configName,
    password: undefined,
  });

  const choices: { name: keyof SweadConfig; checked?: boolean }[] = [
    { name: "production", checked: true },
    { name: "staging", checked: true },
    { name: "local" },
    { name: "dev" },
  ];

  const { methods, password, cfPassword } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "methods",
      choices: choices.filter((choice) => !!config[choice.name]),
      message: "Please choose the methods you want to encrypt.",
    },
    {
      type: "password",
      name: "password",
      mask: "*",
      message:
        "Enter the password with which the server data is to be encrypted.",
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

  const { separatedConfig, separatedEncryptionData } = separateEncryptionData(
    pick(config, methods)
  );

  if (isEmpty(separatedEncryptionData)) {
    exit("There is no data to encrypt.");
  }

  const encryptedString = cryptr.encrypt(
    JSON.stringify(separatedEncryptionData)
  );

  set(config, "encrypted", encryptedString);

  const newConfig = merge(config, separatedConfig);

  await updateConfig(newConfig, { name: configName });

  logger.finished("The server data has been successfully encrypted.");
};
