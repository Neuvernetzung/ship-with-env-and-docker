/* eslint-disable no-console */
import chalk from "chalk";

export const logger = {
  start(...args: unknown[]) {
    console.time(chalk.blue("Time to completion"));
    console.time(chalk.red("Time until error"));
    console.log(chalk.blue(...args, "💦"));
  },
  error(...args: unknown[]) {
    console.timeEnd(chalk.red("Time until error"));
    console.log(chalk.red("✖", ...args));
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow("⚠"), ...args);
  },
  task(...args: unknown[]) {
    console.log(chalk.yellow("❯"), ...args);
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan("🛈"), ...args);
  },
  default(...args: unknown[]) {
    console.log("›", ...args);
  },
  success(...args: unknown[]) {
    console.log(chalk.green("✔"), ...args);
  },
  finished(...args: unknown[]) {
    console.timeEnd(chalk.blue("Time to completion"));
    console.log(chalk.blue("💦", ...args));
  },
};
