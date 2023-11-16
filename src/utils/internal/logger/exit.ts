import { logger } from "./index";

export const exit = (message?: string) => {
  logger.finished(message);
  process.exit(0);
};
