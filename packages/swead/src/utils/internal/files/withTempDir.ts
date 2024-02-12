import { temporaryDirectoryTask } from "tempy";

export const withTempDir = async (fn: (dir: string) => Promise<any>) => {
  return await temporaryDirectoryTask(async (tempDir) => await fn(tempDir));
};
