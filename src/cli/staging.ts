import {
  getConfig,
  errorHandler,
  run,
  validateGit,
  exit,
} from "../utils/internal/index.js";

export const runStaging = async () => {
  const { env, config } = await getConfig();

  await validateGit(config.branches?.staging);

  if (!config.staging) throw new Error("Staging is not defined in config.");

  await run(config.staging, env);

  exit("The staging deployment has finished.");
};

runStaging().catch(errorHandler);
