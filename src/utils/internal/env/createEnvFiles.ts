import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { parseEnv } from "./parseEnv.js";
import { writeEnv } from "./writeEnv.js";
import {
  EnvEntry,
  EnvSchemas,
  EnvLocationUnion,
} from "../../../types/index.js";

export const createEnvFiles = async (
  envSchemas: EnvSchemas | undefined,
  data: EnvEntry | EnvEntry[] | undefined,
  envLocalations?: EnvLocationUnion
) => {
  await performSingleOrMultiple(data, async ({ key, data }) => {
    const parsedEnv = parseEnv(envSchemas, key, data);
    if (!parsedEnv) return;
    await writeEnv(parsedEnv, envLocalations);
  });
};
