import isArray from "lodash/isArray";
import { SweadConfig } from "../types/config";
import { EnvSchemas } from "../types/env";
import {
  clean,
  concurrentNodeProcess,
  createEnvFiles,
  performSingleOrMultiple,
  runNodeProcess,
  openInBrowser,
  runTasks,
  logger,
} from "../utils/internal/index";
import { loadDeploy } from "../utils/internal/deploy/loadDeploy";
import { Args } from "../index";

export const runDev = async (
  envSchemas: EnvSchemas | undefined,
  config: SweadConfig,
  args: Args
) => {
  if (!config.dev) throw new Error("Dev is not defined in config.");

  logger.start("Swead dev started.");

  const deploy = await loadDeploy("dev", args);

  await runTasks(
    [
      {
        title: "Clean up and creating environment files.",
        task: async (ctx) => {
          await performSingleOrMultiple(
            ctx,
            async (dev) => {
              await clean(dev.cleanUp);
              await createEnvFiles(envSchemas, deploy.envs, dev.env);
            },
            {
              strict: true,
              title: "Dev Server",
            }
          );
        },
      },
      {
        title: "Starting development servers",
        task: (ctx) => {
          runNodeProcess(
            concurrentNodeProcess(
              (isArray(ctx) ? ctx : [ctx]).map((app) => ({
                command: app.dev.command,
                name: app.name,
                waitOn: app.waitOn,
              }))
            )
          ); // absichtlich nicht mit await

          performSingleOrMultiple(config.dev, async (command) => {
            command.open && openInBrowser(command.open);
          });
        },
      },
    ],
    { ctx: config.dev }
  );
};
