import isArray from "lodash/isArray.js";
import { errorHandler } from "../utils/internal/errorHandler.js";
import {
  clean,
  concurrentNodeProcess,
  createEnvFiles,
  getConfig,
  performSingleOrMultiple,
  runNodeProcess,
  openInBrowser,
  runTasks,
} from "../utils/internal/index.js";

const runDev = async () => {
  const { env, config } = await getConfig();

  if (!config.dev) throw new Error("Dev is not defined in config.");

  await runTasks(
    [
      {
        title: "Clean up and creating environment files.",
        task: async (ctx) => {
          await performSingleOrMultiple(
            ctx,
            async (dev) => {
              await clean(dev.cleanUp);
              await createEnvFiles(env, dev.env);
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

runDev().catch(errorHandler);
