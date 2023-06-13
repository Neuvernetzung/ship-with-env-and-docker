import inquirer from "inquirer";
import { getConfig, logger, updateConfig } from "../utils/internal/index.js";

export const runDecrypt = async (configName?: string) => {
  logger.start("Swead decrypt started.");

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

  if (!config) throw new Error("Config does not exist!");
  if (!config.encrypted)
    throw new Error("There is no encrypted data in the config!");

  delete config.encrypted;

  await updateConfig(config, { name: configName });

  logger.finished("The server data has been decrypted and can now be edited.");
};
