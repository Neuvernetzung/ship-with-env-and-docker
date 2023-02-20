import { findUp } from "find-up";
import "ts-node/register";
import { ConfigFile } from "../../../types/config.js";

export const getConfig = async (): Promise<ConfigFile> => {
  const configPath = await findUp("swead-config.ts");
  if (!configPath)
    throw new Error(
      'No configuration file found. Please create "swead-config.ts" in your root directory.'
    );

  const config = await import(`file://${configPath}`);
  if (!config) throw new Error("There was an error loading the config.");

  return config.default
    ? (config.default as ConfigFile)
    : (config as ConfigFile);
};
