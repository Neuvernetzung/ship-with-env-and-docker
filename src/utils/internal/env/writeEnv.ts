import { ParsedEnv } from "../../../types/config.js";
import { writeFile } from "fs/promises";
import { formatEnvPath, formatEnvData } from "./index.js";

export const writeEnv = async (env: ParsedEnv) => {
  const envPath = formatEnvPath(env.path);
  const envData = formatEnvData(env.data);

  await writeFile(envPath, envData);
};
