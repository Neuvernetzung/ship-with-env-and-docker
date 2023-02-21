import isArray from "lodash/isArray.js";
import { Command } from "../../../types/config.js";
import { withWaitOn } from "./withWaitOn.js";

export const concurrentProcess = (commands: Command | Command[]) => {
  const names = isArray(commands)
    ? wrapInQuotes(commands.map(({ name }) => name).join(","))
    : wrapInQuotes(commands.name);

  const finalCommands = isArray(commands)
    ? commands
        .map(({ command, waitOn }) => wrapInQuotes(withWaitOn(command, waitOn)))
        .join(" ")
    : wrapInQuotes(withWaitOn(commands.command, commands.waitOn));

  const colors = isArray(commands)
    ? wrapInQuotes(concurrentColors.slice(0, commands.length).join(","))
    : wrapInQuotes(concurrentColors[0]);

  return `concurrently -n ${names} -c ${colors} ${finalCommands}`;
};

const wrapInQuotes = (str: string) => `"${str}"`;

const concurrentColors = [
  "bgBlue.bold",
  "bgGreen.bold",
  "bgViolet.bold",
  "bgMagenta.bold",
  "bgCyan.bold",
];
