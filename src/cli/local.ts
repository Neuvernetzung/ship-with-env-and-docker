import isArray from "lodash/isArray.js";
import {
  getConfig,
  errorHandler,
  performSingleOrMultiple,
  clean,
  createEnvFiles,
  runNodeProcess,
  concurrentNodeProcess,
  openInBrowser,
  runTasks,
} from "../utils/internal/index.js";

export const production = async () => {
  const { env, config } = await getConfig();

  if (!config.local) throw new Error("Production is not defined in config.");

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

production().catch(errorHandler);
