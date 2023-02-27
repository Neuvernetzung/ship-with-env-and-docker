import path from "path";
import { join } from "../index.js";

export const WORKDIR_NAME = "workdir";

export const getWorkdirPath = (dir?: string) =>
  dir ? dir : join(".", WORKDIR_NAME);

export const getWorkdirSubPath = (dir: string | undefined, subDir: string) =>
  join(getWorkdirPath(dir), subDir);
