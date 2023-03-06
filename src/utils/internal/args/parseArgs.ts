import minimist from "minimist";
import { zArgs } from "../../../types/args.js";
import { formatZodErrors, logger, showUsage } from "../index.js";

export const parseArgs = (args: minimist.Opts) => {
  const originalArgs = minimist(process.argv.slice(2), args);

  if (originalArgs.help) {
    showUsage();
  }

  const parsedArgs = zArgs.safeParse(originalArgs);

  if (!parsedArgs?.success) {
    logger.error("Invalid args:\n", formatZodErrors(parsedArgs.error.issues));
    logger.info(`You can display usage with the "-h" or "--help" argument.`);
    throw new Error("Invalid args.");
  }

  return parsedArgs.data;
};
