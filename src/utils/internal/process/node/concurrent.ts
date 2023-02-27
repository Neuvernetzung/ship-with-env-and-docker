import isArray from "lodash/isArray.js";
import { Command } from "../../../../types/config.js";
import { wrapInQuotes } from "../../wrapInQuotes.js";
import { commandWithWaitOn } from "./commandWithWaitOn.js";

export const concurrentNodeProcess = (commands: Command | Command[]) => {
  const names = isArray(commands)
    ? wrapInQuotes(commands.map(({ name }) => name).join(","))
    : wrapInQuotes(commands.name);

  const finalCommands = isArray(commands)
    ? commands
        .map(({ command, waitOn }) =>
          wrapInQuotes(commandWithWaitOn(command, waitOn))
        )
        .join(" ")
    : wrapInQuotes(commandWithWaitOn(commands.command, commands.waitOn));

  const colors = isArray(commands)
    ? wrapInQuotes(concurrentColors.slice(0, commands.length).join(","))
    : wrapInQuotes(concurrentColors[0]);

  return `concurrently -n ${names} -c ${colors} ${finalCommands}`;
};

const concurrentColors = [
  "bgBlue.bold",
  "bgGreen.bold",
  "bgViolet.bold",
  "bgMagenta.bold",
  "bgCyan.bold",
];
