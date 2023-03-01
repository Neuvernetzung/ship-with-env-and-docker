import isArray from "lodash/isArray.js";
import {
  getConfig,
  errorHandler,
  performSingleOrMultiple,
  clean,
  createEnvFiles,
  runNodeProcess,
  concurrentNodeProcess,
  waitOn,
  openInBrowser,
} from "../utils/internal/index.js";

export const production = async () => {
  const { env, config } = await getConfig();

  if (!config.local) throw new Error("Production is not defined in config.");

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

  runNodeProcess(
    concurrentNodeProcess(
      (isArray(config.local) ? config.local : [config.local]).map((app) => ({
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
};

production().catch(errorHandler);
