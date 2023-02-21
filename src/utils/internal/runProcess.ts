import { execa } from "execa";
import { Command } from "../../types/config.js";
import isArray from "lodash/isArray.js";

export const runProcess = (command: string) => {
  execa(command, { stdio: "inherit" }); // inherit um das verschwinden der Logs zu verhindern, welche durch concurrently auftreten
};

// concurrently(
//   [
//     {
//       name: "Admin",
//       prefixColor: "bgBlue.bold",
//       command: "turbo run dev --scope=admin -- -p 1337",
//     },
//     {
//       name: "Store",
//       prefixColor: "bgGreen.bold",
//       command: "turbo run dev --scope=store",
//     },
//   ],
//   {
//     spawn: (command) => execa(command, { stdio: "inherit" }),
//   }
// ); // Funktioniert nur bedingt, da prefixes nicht mehr angezeigt werden.

export const concurrentProcess = (commands: Command | Command[]) => {
  const names = isArray(commands)
    ? wrapInQuotes(commands.map(({ name }) => name).join(","))
    : wrapInQuotes(commands.name);

  const finalCommands = isArray(commands)
    ? commands.map(({ command }) => wrapInQuotes(command)).join(" ")
    : wrapInQuotes(commands.command);

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
