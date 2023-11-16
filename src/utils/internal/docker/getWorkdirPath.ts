import { join } from "../index";

export const WORKDIR_NAME = "/workdir";

export const getWorkdirPath = (dir?: string) => (dir ? dir : WORKDIR_NAME);

export const getWorkdirSubPath = (dir: string | undefined, subDir: string) =>
  join(getWorkdirPath(dir), subDir);
