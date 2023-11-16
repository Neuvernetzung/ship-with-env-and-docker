import { SweadConfig } from "../types/config";
import { EnvSchemas } from "../types/env";
import { parseConfig } from "./internal/index";

export const sweadConfig = async (
  envSchemas: EnvSchemas,
  config: SweadConfig
) => {
  return await parseConfig(config, envSchemas);
};
