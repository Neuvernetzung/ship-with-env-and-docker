import { SweadConfigFile, zSweadConfigFile } from "../../../types/config.js";
import { formatZodErrors } from "../index.js";

export const testConfig = async (
  config: SweadConfigFile
): Promise<SweadConfigFile> => {
  const parsedConfig = await zSweadConfigFile.safeParseAsync(config);

  if (!parsedConfig?.success) {
    throw new Error(`Invalid config:\n
    ${formatZodErrors(parsedConfig.error.issues)}`);
  }

  return parsedConfig.data;
};
