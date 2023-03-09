import isArray from "lodash/isArray.js";
import { SweadConfig } from "../types/config.js";
import { EnvConfig } from "../types/env.js";
import {
  performSingleOrMultiple,
  clean,
  createEnvFiles,
  runNodeProcess,
  concurrentNodeProcess,
  openInBrowser,
  runTasks,
} from "../utils/internal/index.js";

export const runLocal = async (
  env: EnvConfig | undefined,
  config: SweadConfig
) => {
  if (!config.local) throw new Error("Local is not defined in config.");

  await runTasks(
    [
      {
        title: "Clean up and creating environment files.",
        task: async () => {
          await performSingleOrMultiple(
            config.local,
            async (local) => {
              await clean(local.cleanUp);
              await createEnvFiles(env, local.env);
            },
            {
              strict: true,
              title: "Local Server",
            }
          );
        },
        options: { bottomBar: Infinity },
      },
      {
        title: "Building and starting local servers.",
        task: (ctx) => {
          runNodeProcess(
            concurrentNodeProcess(
              (isArray(ctx) ? ctx : [ctx]).map((app) => ({
                command: `${app.build ? app.build?.command : ""} ${
                  app.build && app.start ? "&&" : ""
                } ${app.start ? app.start?.command : ""}`,
                name: app.name,
                waitOn: app.waitOn,
              }))
            )
          );

          performSingleOrMultiple(config.dev, async (command) => {
            command.open && openInBrowser(command.open);
          });
        },
      },
    ],
    { ctx: config.local }
  );
};
