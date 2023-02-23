import { errorHandler } from "../utils/internal/errorHandler.js";
import {
  clean,
  concurrentNodeProcess,
  createEnvFiles,
  getConfig,
  performSingleOrMultiple,
  runNodeProcess,
  openInBrowser,
} from "../utils/internal/index.js";

const runDev = async () => {
  const { env, config } = await getConfig();

  if (!config.dev) throw new Error("Dev is not defined in config.");

  await performSingleOrMultiple(
    config.dev,
    async (dev) => {
      await clean(dev.cleanUp);
      await createEnvFiles(env, dev.env);
    },
    {
      strict: true,
      title: "Dev Server",
    }
  );

  runNodeProcess(concurrentNodeProcess(config.dev)); // absichtlich nicht mit await

  performSingleOrMultiple(config.dev, async (command) => {
    command.open && openInBrowser(command.open);
  });
};

runDev().catch(errorHandler);
