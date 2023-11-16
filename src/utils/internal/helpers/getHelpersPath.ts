import { join } from "../index";

export const HELPERS_BASE_PATH = "_helpers";

export const getHelpersPath = (subDir: string) =>
  join(HELPERS_BASE_PATH, subDir);
