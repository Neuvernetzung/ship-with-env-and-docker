// import fs from "fs";
// import { execSync } from "child_process";
import { errorHandler } from "../utils/internal/errorHandler.js";
import {
  cleanCache,
  createEnvFiles,
  getConfig,
  performSingleOrMultiple,
} from "../utils/internal/index.js";

const runDev = async () => {
  const { env, config } = await getConfig();

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

  // execSync("npm run dev:all", {
  //   stdio: "inherit",
  //   cwd: "./",
  // });
};

runDev().catch(errorHandler);
