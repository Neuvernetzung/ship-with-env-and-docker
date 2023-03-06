import minimist from "minimist";
import { zArgs } from "../../../types/args.js";
import { formatZodErrors, logger } from "../index.js";

export const parseArgs = (args: minimist.Opts) => {
  const originalArgs = minimist(process.argv.slice(2), args);

  const parsedArgs = zArgs.safeParse(originalArgs);

  if (!parsedArgs?.success) {
    logger.error("Invalid args:\n", formatZodErrors(parsedArgs.error.issues));
    logger.info(`You can display help with the "-h" argument.`);
    throw new Error("Invalid args.");
  }

  return parsedArgs.data;
};
