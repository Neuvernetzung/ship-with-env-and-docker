import chalk from "chalk";

export const taskIndex = (i: number, length: number) =>
  length > 1 ? ` - ${chalk.blueBright(`[${i + 1}/${length}]`)}` : "";
