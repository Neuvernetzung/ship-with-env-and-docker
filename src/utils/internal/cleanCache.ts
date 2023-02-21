import { performSingleOrMultiple } from "./performSingleOrMultiple.js";
import { rm } from "fs/promises";

export const cleanCache = async (cachePaths: string | string[] | undefined) => {
  if (!cachePaths) return;
  await performSingleOrMultiple(cachePaths, async (path) => {
    await rm(path, { recursive: true, force: true });
  });
};
