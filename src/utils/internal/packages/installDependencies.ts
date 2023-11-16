import { runNodeProcess } from "../index";
import { getUserPkgManager, PackageManager } from "./getUserPkgManager";

const runInstallCommand = async (
  pkgManager: PackageManager,
  stdout: NodeJS.WritableStream
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

export const installDependencies = async (stdout: NodeJS.WritableStream) => {
  const pkgManager = getUserPkgManager();

  await runInstallCommand(pkgManager, stdout);
};
