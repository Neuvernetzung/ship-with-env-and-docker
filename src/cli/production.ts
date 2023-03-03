import {
  getConfig,
  errorHandler,
  run,
  validateGit,
  exit,
} from "../utils/internal/index.js";

export const production = async () => {
  const { env, config } = await getConfig();

  await validateGit(config.branches?.production);

  if (!config.production)
    throw new Error("Production is not defined in config.");

  await run(config.production, env);

  exit("The production deployment has finished.");
};

production().catch(errorHandler);
