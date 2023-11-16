import minimist from "minimist";
import { zArgs } from "../../../types/args";
import { formatZodErrors, showUsage } from "../index";

export const parseArgs = (args: minimist.Opts) => {
  const originalArgs = minimist(process.argv.slice(2), args);

  if (originalArgs.help) {
    showUsage();
  }

  const parsedArgs = zArgs.safeParse(originalArgs);

  if (!parsedArgs?.success) {
    throw new Error(
      `You can display usage with the "-h" or "--help" argument.\n Invalid args:\n
      ${formatZodErrors(parsedArgs.error.issues)}`
    );
  }

  return parsedArgs.data;
};
