import { Args } from "../index";
import { SweadConfig } from "../types/config";
import { EnvSchemas } from "../types/env";
import { loadDeploy } from "../utils/internal/deploy/loadDeploy";
import { run, validateGit, exit, logger } from "../utils/internal/index";

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
