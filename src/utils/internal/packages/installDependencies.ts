import { runNodeProcess } from "../index.js";
import { getUserPkgManager, PackageManager } from "./getUserPkgManager.js";

const runInstallCommand = async (
  pkgManager: PackageManager,
  stdout: NodeJS.WriteStream & NodeJS.WritableStream
): Promise<void> => {
  switch (pkgManager) {
    case "npm":
      await runNodeProcess(`${pkgManager} install swead -D`, {
        stdout,
      });

      return;

    case "pnpm":
      await runNodeProcess(`${pkgManager} add swead -D`, {
        stdout,
      });

      return;
    case "yarn":
      await runNodeProcess(`${pkgManager} add swead -D`, {
        stdout,
      });

      return;
  }
};

export const installDependencies = async (
  stdout: NodeJS.WriteStream & NodeJS.WritableStream
) => {
  const pkgManager = getUserPkgManager();

  await runInstallCommand(pkgManager, stdout);
};
