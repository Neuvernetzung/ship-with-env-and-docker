import { findUp } from "find-up";
import "ts-node/register";
import { SweadConfigFile } from "../../../types/config.js";
import { testConfig } from "./testConfig.js";

export const getConfig = async (): Promise<SweadConfigFile> => {
  const configPath = await findUp("swead-config.ts");
  if (!configPath)
    throw new Error(
      'No configuration file found. Please create "swead-config.ts" in your root directory.'
    );

  const config = await import(`file://${configPath}`);
  if (!config) throw new Error("There was an error loading the config.");

  const importedConfig = config.default
    ? (config.default as SweadConfigFile)
    : (config as SweadConfigFile);

  const parsedConfig = await testConfig(importedConfig);

  return parsedConfig;
};
