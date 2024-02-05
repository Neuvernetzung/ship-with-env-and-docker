import { execa } from "execa";

export type runNodeOptions = {
  stdout?: NodeJS.WritableStream;
};

export const runNodeProcess = async (
  command: string,
  options?: runNodeOptions
) => {
  const sub = execa(command, {
    stdin: "inherit",
    stderr: options?.stdout ? "pipe" : "inherit",
    stdout: options?.stdout ? "pipe" : "inherit",
    shell: true,
  }); // inherit um das verschwinden der Logs zu verhindern, welche durch concurrently auftreten

  if (options?.stdout) {
    sub.stdout?.pipe(options.stdout); // Um zu ermöglichen, dass listr2 Output gut aus sieht.
    sub.stdout?.pipe(options.stdout); // Um zu ermöglichen, dass listr2 Output gut aus sieht.
  }

  await sub;
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
