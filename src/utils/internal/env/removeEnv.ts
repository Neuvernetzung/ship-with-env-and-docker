import { performSingleOrMultiple } from "../performSingleOrMultiple";
import { rm } from "fs/promises";
import { EnvLocalation } from "../../../types/index";
import { formatEnvPath } from "./formatEnvPath";

export const removeEnv = async (
  envLocalations: EnvLocalation | EnvLocalation[] | undefined
) => {
  await performSingleOrMultiple(envLocalations, async ({ path }) => {
    if (!path) return;

    const formattedPath = formatEnvPath(path);

    await rm(formattedPath, { force: true });
  });
};
