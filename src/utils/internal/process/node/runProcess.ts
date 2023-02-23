import { execa } from "execa";
import { Command } from "../../../../types/config.js";
import { performSingleOrMultiple } from "../../performSingleOrMultiple.js";
import { openInBrowser } from "./openInBrowser.js";

export const runNodeProcess = async (command: string) => {
  await execa(command, { stdio: "inherit" }); // inherit um das verschwinden der Logs zu verhindern, welche durch concurrently auftreten
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
