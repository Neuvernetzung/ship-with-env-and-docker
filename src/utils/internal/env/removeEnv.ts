import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { rm } from "fs/promises";
import { EnvEntry, EnvConfig } from "../../../types/index.js";
import { formatEnvPath } from "./formatEnvPath.js";

export const removeEnv = async (
  env: EnvConfig | undefined,
  data: EnvEntry | EnvEntry[] | undefined
) => {
  await performSingleOrMultiple(data, async ({ key }) => {
    const path = env?.[key]?.path;
    if (!path) return;

    const formattedPath = formatEnvPath(path);

    await rm(formattedPath, { force: true });
  });
};
