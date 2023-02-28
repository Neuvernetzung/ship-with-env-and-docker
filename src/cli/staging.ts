import {
  getConfig,
  errorHandler,
  run,
  validateGit,
} from "../utils/internal/index.js";

export const runStaging = async () => {
  const { env, config } = await getConfig();

  await validateGit(config.branches?.staging);

  if (!config.staging) throw new Error("Staging is not defined in config.");

  await run(config.staging, env);
};

runStaging().catch(errorHandler);
