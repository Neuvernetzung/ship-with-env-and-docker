import { EnvLocationUnion, ParsedEnv } from "../../../types/index.js";
import { performSingleOrMultiple, write } from "../index.js";
import { formatEnvPath, formatEnvData } from "./index.js";

export const writeEnv = async (
  parsedEnv: ParsedEnv,
  envLocalations?: EnvLocationUnion
) => {
  await performSingleOrMultiple(envLocalations, async (env) => {
    if (env.key !== parsedEnv.key) return;

    const envPath = formatEnvPath(env.path);
    const envData = formatEnvData(parsedEnv.data);

    await write(envPath, envData);
  });
};
