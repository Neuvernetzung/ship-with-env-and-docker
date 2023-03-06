import { SweadConfig } from "../types/config.js";
import { EnvConfig } from "../types/env.js";
import { testConfig } from "./internal/index.js";

export const sweadConfig = async (env: EnvConfig, config: SweadConfig) => {
  return await testConfig({ env, config });
};
