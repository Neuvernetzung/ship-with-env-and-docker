import { concurrently } from "concurrently";
import { execa } from "execa";
import { errorHandler } from "../utils/internal/errorHandler.js";
import {
  cleanCache,
  createEnvFiles,
  forceColor,
  getConfig,
  performSingleOrMultiple,
} from "../utils/internal/index.js";

const runDev = async () => {
  const { env, config } = await getConfig();

  if (!config.dev) throw new Error("Dev is not defined in config.");

  await performSingleOrMultiple(
    config.dev,
    async (dev) => {
      await cleanCache(dev.cacheToClean); // SPÄTER WIEDER REIN MACHEN, WENN SICH PROZESS BEENDEN LÄSST
      await createEnvFiles(env, dev.env);
    },
    {
      strict: true,
      title: "Dev Server",
    }
  );

  execa(
    `${forceColor} concurrently --names "ADMIN,STORE" -c "bgBlue.bold,bgGreen.bold" "turbo run dev --scope=admin -- -p 1337" "turbo run dev --scope=store"`,
    { stdio: "inherit" }
  );
};

runDev().catch(errorHandler);
