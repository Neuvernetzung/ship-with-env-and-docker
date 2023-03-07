import { findUp } from "find-up";
import { SweadConfigFile } from "../../../types/config.js";
import { decryptConfigData, runTasks } from "../index.js";
import { testConfig } from "./testConfig.js";
import { bundleRequire } from "bundle-require";
import inquirer from "inquirer";

export const CONFIG_DEFAULT_NAME = "swead-config.ts";

export const ENC_CONFIG_DEFAULT_NAME = "swead-config.enc";

type ConfigOptions = {
  config?: string;
  password?: string;
};

export const getConfig = async (
  opts: ConfigOptions
): Promise<SweadConfigFile> => {
  const encConfigPath = await findUp(
    opts.config
      ? opts.config.replace(".js", ".enc").replace(".ts", ".enc")
      : ENC_CONFIG_DEFAULT_NAME
  );
  let password: string;

  if (opts.password) {
    password = opts.password;
  } else if (encConfigPath) {
    const result = await inquirer.prompt([
      {
        type: "password",
        name: "password",
        mask: "*",
        message:
          "Enter the password with which the server data is to be decrypted.",
      },
    ]);
    password = result.password;
  }

  return await runTasks({
    title: "Loading config",
    task: async (ctx) => {
      let config;

      if (encConfigPath) {
        config = await decryptConfigData(password, encConfigPath);
      } else {
        const configPath = await findUp(opts.config || CONFIG_DEFAULT_NAME);
        if (!configPath)
          throw new Error(
            `No configuration file found. Please create "${
              opts.config || CONFIG_DEFAULT_NAME
            }" in your root directory.`
          );
        const { mod } = await bundleRequire({
          filepath: configPath,
        });
        config = mod;
      }

      if (!config) throw new Error("There was an error loading the config.");

      const importedConfig = config.default
        ? (config.default as SweadConfigFile)
        : (config as SweadConfigFile);

      const parsedConfig = await testConfig(importedConfig);

      ctx.env = parsedConfig.env;
      ctx.config = parsedConfig.config;
    },
    options: { bottomBar: Infinity },
  });
};
