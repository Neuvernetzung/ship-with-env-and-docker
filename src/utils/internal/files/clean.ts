import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { rm } from "fs/promises";
import { globToPaths } from "./globToPaths.js";

export const clean = async (paths: string | string[] | undefined) => {
  if (!paths) return;
  const _paths = await globToPaths(paths, { ignore: [] });

  await performSingleOrMultiple(_paths, async (path) => {
    await rm(path, { recursive: true, force: true });
  });
};
