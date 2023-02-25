import { temporaryDirectoryTask } from "tempy";

export const withTempDir = async (fn: (dir: string) => Promise<void>) => {
  await temporaryDirectoryTask(async (tempDir) => await fn(tempDir));
};
