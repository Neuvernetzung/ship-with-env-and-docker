import { Args } from "../index.js";
import { SweadConfig } from "../types/config.js";
import { EnvSchemas } from "../types/env.js";
import { loadDeploy } from "../utils/internal/deploy/loadDeploy.js";
import { run, validateGit, exit, logger } from "../utils/internal/index.js";

export const runStaging = async (
  env: EnvSchemas | undefined,
  config: SweadConfig,
  args: Args
) => {
  await validateGit(config.branches?.staging);

  logger.start("Swead staging started.");

  if (!config.server) throw new Error("Staging is not defined in config.");

  const serverDeploy = await loadDeploy("staging", args);

  await run(config.server, env, serverDeploy, args);

  exit("The staging deployment has finished.");
};
