import { SweadConfig } from "../types/config.js";
import { EnvConfig } from "../types/env.js";
import {
  run,
  validateGit,
  exit,
  RunOptions,
  logger,
} from "../utils/internal/index.js";

export const runProduction = async (
  env: EnvConfig | undefined,
  config: SweadConfig,
  opts: RunOptions
) => {
  await validateGit(config.branches?.production);

  logger.start("Swead production started.");

  if (!config.production)
    throw new Error("Production is not defined in config.");

  await run(config.production, env, opts);

  exit("The production deployment has finished.");
};
