import { errorHandler } from "../utils/internal/errorHandler.js";
import {
  cleanCache,
  concurrentProcess,
  createEnvFiles,
  getConfig,
  performSingleOrMultiple,
  runProcess,
} from "../utils/internal/index.js";

const runDev = async () => {
  const { env, config } = await getConfig();

  if (!config.dev) throw new Error("Dev is not defined in config.");

  await performSingleOrMultiple(
    config.dev,
    async (dev) => {
      await cleanCache(dev.cacheToClean);
      await createEnvFiles(env, dev.env);
    },
    {
      strict: true,
      title: "Dev Server",
    }
  );

  runProcess(concurrentProcess(config.dev));
};

runDev().catch(errorHandler);
