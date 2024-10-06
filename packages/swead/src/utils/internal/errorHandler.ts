/* eslint-disable no-console */
import { clean, LOCAL_ARTIFACT_DIR } from "./index.js";
import { logger } from "./index.js";

export const errorHandler = async (err: Error) => {
  logger.error("Aborting cli...");

  await clean(LOCAL_ARTIFACT_DIR);

  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      "An unknown error has occurred. Please open an issue on github with the below:"
    );
    logger.default(err);
  }
  process.exit(1);
};
