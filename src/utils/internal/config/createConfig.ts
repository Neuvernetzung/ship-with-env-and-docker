import { writeFile } from "fs/promises";
import { CONFIG_DEFAULT_NAME } from "./getConfig.js";
import { existsSync } from "fs";
import path from "path";

type CreateConfigOpts = {
  name?: string;
};

export const createConfig = async (opts: CreateConfigOpts) => {
  const cfgName = opts.name || CONFIG_DEFAULT_NAME;

  const configPath = path.resolve(process.cwd(), cfgName);

  if (existsSync(configPath)) {
    throw new Error(`Config file "${configPath}" already exists.`);
  }

  await writeFile(configPath, configBoilerPlate);
};

const configBoilerPlate = `import { z } from "zod";
import { EnvConfig, SweadConfig } from "swead";

export const env = {
  example: z.string(),
} satisfies EnvConfig;

export const config: SweadConfig<typeof env> = {
  dev: [],
  local: [],
  branches: {
    staging: "develop",
    production: "master",
  },
  staging: [],
  production: [],
};
`;
