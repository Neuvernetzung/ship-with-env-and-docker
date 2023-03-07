import { SweadConfig } from "../types/config.js";
import { EnvConfig } from "../types/env.js";
import { run, validateGit, exit, RunOptions } from "../utils/internal/index.js";

export const runStaging = async (
  env: EnvConfig | undefined,
  config: SweadConfig,
  opts: RunOptions
) => {
  await validateGit(config.branches?.staging);

  if (!config.staging) throw new Error("Staging is not defined in config.");

  await run(config.staging, env, opts);

  exit("The staging deployment has finished.");
};
