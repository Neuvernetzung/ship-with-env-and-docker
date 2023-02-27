import { ParsedEnv } from "../../../types/config.js";
import { write } from "../index.js";
import { formatEnvPath, formatEnvData } from "./index.js";

export const writeEnv = async (env: ParsedEnv) => {
  const envPath = formatEnvPath(env.path);
  const envData = formatEnvData(env.data);

  await write(envPath, envData);
};
