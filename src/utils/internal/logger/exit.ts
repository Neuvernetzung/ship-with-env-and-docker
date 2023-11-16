import { logger } from "./index.js";

export const exit = (message?: string) => {
  logger.finished(message);
  process.exit(0);
};
