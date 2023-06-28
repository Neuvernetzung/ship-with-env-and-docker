import { Args } from "../index.js";
import { SweadConfig } from "../types/config.js";
import { EnvSchemas } from "../types/env.js";
import { loadDeploy } from "../utils/internal/deploy/loadDeploy.js";
import { run, validateGit, exit, logger } from "../utils/internal/index.js";

export const runProduction = async (
  env: EnvSchemas | undefined,
  config: SweadConfig,
  args: Args
) => {
  await validateGit(config.branches?.production);

  logger.start("Swead production started.");

  if (!config.server) throw new Error("Server is not defined in config.");

  const serverDeploy = await loadDeploy("production", args);

  await run(config.server, env, serverDeploy, args);

  exit("The production deployment has finished.");
};
