import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { parseEnv } from "./parseEnv.js";
import { writeEnv } from "./writeEnv.js";
import { EnvEntry, EnvConfig } from "../../../types/index.js";

export const createEnvFiles = async (
  env: EnvConfig | undefined,
  data: EnvEntry | EnvEntry[] | undefined
) => {
  await performSingleOrMultiple(data, async ({ key, data }) => {
    const parsedEnv = parseEnv(env, key, data);
    if (!parsedEnv) return;
    await writeEnv(parsedEnv);
  });
};
