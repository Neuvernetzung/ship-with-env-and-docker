import { findUp } from "find-up";
import { SweadConfigFile } from "../../../types/config.js";
import { runTasks } from "../index.js";
import { testConfig } from "./testConfig.js";
import { bundleRequire } from "bundle-require";

export const CONFIG_DEFAULT_NAME = "swead-config.ts";

export const getConfig = async (
  configName?: string
): Promise<SweadConfigFile> => {
  return await runTasks({
    title: "Loading config",
    task: async (ctx) => {
      const configPath = await findUp(configName || CONFIG_DEFAULT_NAME);
      if (!configPath)
        throw new Error(
          `No configuration file found. Please create "${
            configName || CONFIG_DEFAULT_NAME
          }" in your root directory.`
        );
      const { mod: config } = await bundleRequire({
        filepath: configPath,
      });
      if (!config) throw new Error("There was an error loading the config.");

      const importedConfig = config.default
        ? (config.default as SweadConfigFile)
        : (config as SweadConfigFile);

      const parsedConfig = await testConfig(importedConfig);

      ctx.env = parsedConfig.env;
      ctx.config = parsedConfig.config;
    },
  });
};
