import { performSingleOrMultiple } from "../performSingleOrMultiple";
import { rm } from "fs/promises";
import { globToPaths } from "./globToPaths";

export const clean = async (paths: string | string[] | undefined) => {
  if (!paths) return;
  const _paths = await globToPaths(paths);

  await performSingleOrMultiple(_paths, async (path) => {
    await rm(path, { recursive: true, force: true });
  });
};
