import { existsSync } from "fs";
import {
  getPkgJson,
  installDependencies,
  logger,
  runTasks,
  updateGitIgnore,
  writePkgJson,
  GITIGNORE_FILE_PATH,
} from "../utils/internal/index.js";
import { createConfig } from "../utils/internal/index.js";

export const runInit = async (configName?: string) => {
  logger.start("Swead initialization started.");

  await runTasks([
    {
      title: "Creating config boilerplate",
      task: async () => await createConfig({ name: configName }),
    },
    {
      title: "Updating Package.json",
      task: async () => {
        const pkgJson = await getPkgJson();
        pkgJson.scripts = {
          ...pkgJson.scripts,
          "dev:swead": `npx swead dev ${configName ? `-c ${configName}` : ""}`,
          "local:swead": `npx swead local ${
            configName ? `-c ${configName}` : ""
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
      options: { bottomBar: Infinity },
    },
    {
      title: "Update .gitignore",
      skip: !existsSync(GITIGNORE_FILE_PATH),
      task: async () => await updateGitIgnore(configName),
    },
  ]);

  logger.finished("Swead initialization finished.");
};
