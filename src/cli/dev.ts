import { errorHandler } from "../utils/internal/errorHandler.js";
import {
  cleanCache,
  concurrentProcess,
  createEnvFiles,
  getConfig,
  performSingleOrMultiple,
  runProcess,
} from "../utils/internal/index.js";
import dns from "node:dns";

const runDev = async () => {
  dns.setDefaultResultOrder("ipv4first");
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

  runProcess(concurrentProcess(config.dev), config.dev);
};

runDev().catch(errorHandler);
