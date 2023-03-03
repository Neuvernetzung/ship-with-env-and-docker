import { SweadConfigFile, zSweadConfigFile } from "../../../types/config.js";
import { formatZodErrors, logger } from "../index.js";

export const testConfig = async (
  config: SweadConfigFile
): Promise<SweadConfigFile> => {
  const parsedConfig = await zSweadConfigFile.safeParseAsync(config);

  if (!parsedConfig?.success) {
    logger.error(
      "Invalid config:\n",
      formatZodErrors(parsedConfig.error.issues)
    );
    throw new Error("Invalid environment variables");
  }

  return parsedConfig.data;
};
