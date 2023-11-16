import { Args } from "../../../index.js";
import { join, logger } from "../index.js";
import { ParsedConfigs, parseConfig } from "./parseConfig.js";
import { bundleRequire } from "bundle-require";
import { existsSync } from "fs";

export const SWEAD_BASE_PATH = "_swead";

export const CONFIG_NAME = "config.ts";
export const ENV_SCHEMAS_NAME = "envSchemas.ts";

export const getConfig = async (args: Args): Promise<ParsedConfigs> => {
  const configBasePath = args.config || SWEAD_BASE_PATH;
  const configPath = join(configBasePath, CONFIG_NAME);

  if (!existsSync(configPath))
    throw new Error(
      `No configuration file found. Please create "${configPath}" in your root directory.`
    );

  const { mod: configMod } = await bundleRequire({
    filepath: configPath,
  });

  const envSchemasPath = join(configBasePath, ENV_SCHEMAS_NAME);

  if (!existsSync(envSchemasPath))
    throw new Error(
      `No env Schemas file found. Please create "${envSchemasPath}" in your root directory.`
    );

  const { mod: envSchemasMod } = await bundleRequire({
    filepath: envSchemasPath,
  });

  const parsedConfigFile = await parseConfig(
    configMod.default,
    envSchemasMod.default
  );

  logger.task("Loading config");

  return parsedConfigFile;
};
