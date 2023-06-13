import { findUp } from "find-up";
import { SweadConfigFile } from "../../../types/config.js";
import { decryptConfigData, logger } from "../index.js";
import { testConfig } from "./testConfig.js";
import { bundleRequire } from "bundle-require";
import inquirer from "inquirer";
import merge from "lodash/merge.js";
import { runMethods } from "../../../types/args.js";

export const CONFIG_DEFAULT_NAME = "swead-config.ts";

type ConfigOptions = {
  config?: string;
  password?: string;
  method?: (typeof runMethods)[number];
};

export const getConfig = async (
  opts: ConfigOptions
): Promise<SweadConfigFile> => {
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

  const needsDecryption =
    opts.password ||
    (mod.config.encrypted && opts.method ? mod.config[opts.method] : false);

  const result = opts.password
    ? { password: opts.password }
    : needsDecryption &&
      (await inquirer.prompt([
        {
          type: "password",
          name: "password",
          mask: "*",
          message:
            "Enter the password with which the server data is to be decrypted.",
        },
      ]));

  logger.task("Loading config");

  const importedConfigFile: SweadConfigFile = needsDecryption
    ? merge(
        {
          config: decryptConfigData(result.password, mod.config.encrypted),
        },
        mod
      )
    : mod;

  const parsedConfigFile = await testConfig(importedConfigFile);

  return { env: parsedConfigFile.env, config: parsedConfigFile.config };
};
