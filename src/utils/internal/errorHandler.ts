/* eslint-disable no-console */
import { logger } from "./logger.js";

export const errorHandler = (err: any) => {
  logger.error("Aborting cli...");
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      "An unknown error has occurred. Please open an issue on github with the below:"
    );
    console.log(err);
  }
  process.exit(1);
};
