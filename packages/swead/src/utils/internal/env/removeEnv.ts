import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { rm } from "fs/promises";
import { EnvLocalation } from "../../../types/index.js";
import { formatEnvPath } from "./formatEnvPath.js";

export const removeEnv = async (
  envLocalations: EnvLocalation | EnvLocalation[] | undefined
) => {
  await performSingleOrMultiple(envLocalations, async ({ path }) => {
    if (!path) return;

    const formattedPath = formatEnvPath(path);

    await rm(formattedPath, { force: true });
  });
};
