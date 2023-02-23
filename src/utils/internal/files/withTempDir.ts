import { temporaryDirectory, temporaryDirectoryTask } from "tempy";
import { clean } from "./clean.js";

export const withTempDir = async (fn: (dir: string) => Promise<void>) => {
  await temporaryDirectoryTask(async (tempDir) => await fn(tempDir));
};
