import { SweadConfig } from "../types/config.js";
import { EnvSchemas } from "../types/env.js";
import { parseConfig } from "./internal/index.js";

export const sweadConfig = async (
  envSchemas: EnvSchemas,
  config: SweadConfig
) => {
  return await parseConfig(config, envSchemas);
};
