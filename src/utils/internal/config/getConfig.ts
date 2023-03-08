import { findUp } from "find-up";
import { SweadConfigFile } from "../../../types/config.js";
import { decryptConfigData, runTasks } from "../index.js";
import { testConfig } from "./testConfig.js";
import { bundleRequire } from "bundle-require";
import inquirer from "inquirer";
import merge from "lodash/merge.js";
import { runMethods } from "../../../types/args.js";

export const CONFIG_DEFAULT_NAME = "swead-config.ts";

export const ENC_CONFIG_DEFAULT_NAME = "swead-config.enc";

type ConfigOptions = {
  config?: string;
  password?: string;
  method?: (typeof runMethods)[number];
};

export const getConfig = async (
  opts: ConfigOptions
): Promise<SweadConfigFile> => {
  const configPath = await findUp(opts.config || CONFIG_DEFAULT_NAME);

  const encConfigPath = await findUp(
    opts.config
      ? opts.config.replace(".js", ".enc").replace(".ts", ".enc")
      : ENC_CONFIG_DEFAULT_NAME
  );

  if (!encConfigPath && !configPath)
    throw new Error(
      `No configuration file found. Please create "${
        opts.config || CONFIG_DEFAULT_NAME
      }" in your root directory.`
    );

  const methodIncludedInDecrypted =
    opts.method && configPath
      ? (
          await bundleRequire({
            filepath: configPath,
          })
        ).mod.config[opts.method]
      : false;

  let password: string;

  if (opts.password) {
    password = opts.password;
  } else if (encConfigPath && !methodIncludedInDecrypted) {
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
      let configFile: Partial<SweadConfigFile> = {};

      if (encConfigPath && !methodIncludedInDecrypted) {
        configFile = {
          config: await decryptConfigData(password, encConfigPath),
        };
      }

      if (configPath) {
        const { mod } = await bundleRequire({
          filepath: configPath,
        });
        configFile = merge(configFile, mod);
      }

      if (!configFile)
        throw new Error("There was an error loading the config.");

      const importedConfig = configFile as SweadConfigFile;

      const parsedConfig = await testConfig(importedConfig);

      console.log("parsed", parsedConfig);
      ctx.env = parsedConfig.env;
      ctx.config = parsedConfig.config;
    },
    options: { bottomBar: Infinity },
  });
};
