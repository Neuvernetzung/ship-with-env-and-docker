import path from "path";

export const WORKDIR_NAME = "workdir";

export const getWorkdirPath = (dir?: string) =>
  dir ? dir : path.join(".", WORKDIR_NAME);

export const getWorkdirSubPath = (dir: string | undefined, subDir: string) =>
  path.join(getWorkdirPath(dir), subDir);
