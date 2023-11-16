import { performSingleOrMultiple } from "../performSingleOrMultiple";
import { parseEnv } from "./parseEnv";
import { writeEnv } from "./writeEnv";
import { EnvEntry, EnvSchemas, EnvLocationUnion } from "../../../types/index";

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
