import { existsSync } from "fs";
import {
  getPkgJson,
  installDependencies,
  logger,
  runTasks,
  updateGitIgnore,
  writePkgJson,
  GITIGNORE_FILE_PATH,
} from "../utils/internal/index";
import { createConfigs } from "../utils/internal/index";
import { Args } from "../index";

export const runInit = async (args: Args) => {
  logger.start("Swead initialization started.");

  await runTasks([
    {
      title: "Creating config boilerplate",
      task: async () => await createConfigs(args),
    },
    {
      title: "Updating Package.json",
      task: async () => {
        const pkgJson = await getPkgJson();
        pkgJson.scripts = {
          ...pkgJson.scripts,
          "dev:swead": `npx swead dev${
            args.config ? ` -c ${args.config}` : ""
          }`,
        };
        await writePkgJson(pkgJson);
      },
    },
    {
      title: "Installing swead as devDependency",
      skip: async () => {
        const pkgJson = await getPkgJson();
        return !!pkgJson?.devDependencies?.swead || pkgJson?.name === "swead"; // Bereits installiert, oder ist dev Modus
      },
      task: async (_, task) => await installDependencies(task.stdout()),
    },
    {
      title: "Update .gitignore",
      skip: !existsSync(GITIGNORE_FILE_PATH),
      task: async () => await updateGitIgnore(args.config),
    },
  ]);

  logger.finished("Swead initialization finished.");
};
