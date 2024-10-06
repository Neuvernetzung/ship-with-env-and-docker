import { temporaryDirectoryTask } from "tempy";

export const withTempDir = async <TPromise>(
  fn: (dir: string) => Promise<TPromise>
) => {
  return await temporaryDirectoryTask(async (tempDir) => await fn(tempDir));
};
