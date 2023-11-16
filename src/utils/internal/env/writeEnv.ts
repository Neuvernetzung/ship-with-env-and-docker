import { EnvLocationUnion, ParsedEnv } from "../../../types/index";
import { performSingleOrMultiple, write } from "../index";
import { formatEnvPath, formatEnvData } from "./index";

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
