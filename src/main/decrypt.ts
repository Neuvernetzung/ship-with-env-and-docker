import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import {
  CONFIG_DEFAULT_NAME,
  createConfig,
  ENC_CONFIG_DEFAULT_NAME,
  getConfig,
  logger,
  updateConfig,
} from "../utils/internal/index.js";
import { unlink } from "fs/promises";

export const runDecrypt = async (configName?: string) => {
  const cfgName = configName || CONFIG_DEFAULT_NAME;
  const configPath = path.resolve(process.cwd(), cfgName);

  const encCfgName =
    configName?.replace(".js", ".enc").replace(".ts", ".enc") ||
    ENC_CONFIG_DEFAULT_NAME;
  const encConfigPath = path.resolve(process.cwd(), encCfgName);

  if (!fs.existsSync(encConfigPath))
    throw new Error(`Config file "${encCfgName}" does not exist.`);

  const { password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      mask: "*",
      message:
        "Enter the password with which the server data is to be decrypted.",
    },
  ]);

  const { config } = await getConfig({
    config: configName,
    password,
  });

  if (fs.existsSync(configPath)) {
    await updateConfig(config, { name: configName });
  } else {
    await createConfig({ name: configName });
    await updateConfig(config, { name: configName });
  }

  await unlink(encConfigPath);

  logger.finished("The server data has been decrypted and can now be edited.");
};
