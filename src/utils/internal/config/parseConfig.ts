import { EnvSchemas, zEnvSchemas } from "../../../index.js";
import { SweadConfig, zSweadConfig } from "../../../types/config.js";
import { formatZodErrors } from "../index.js";

export type ParsedConfigs = { config: SweadConfig; envSchemas: EnvSchemas };

export const parseConfig = async (
  config: SweadConfig,
  envSchemas: EnvSchemas
): Promise<ParsedConfigs> => {
  const parsedConfig = await zSweadConfig.safeParseAsync(config);

  if (!parsedConfig?.success) {
    throw new Error(`Invalid config:\n
    ${formatZodErrors(parsedConfig.error.issues)}`);
  }

  const parsedEnvSchemas = await zEnvSchemas.safeParseAsync(envSchemas);

  if (!parsedEnvSchemas?.success) {
    throw new Error(`Invalid config:\n
    ${formatZodErrors(parsedEnvSchemas.error.issues)}`);
  }

  return { config: parsedConfig.data, envSchemas: parsedEnvSchemas.data };
};
