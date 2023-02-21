import { EnvConfig } from "../../../types/config.js";
import { logger } from "../logger.js";
import { formatZodErrors } from "./formatZodErrors.js";

export const parseEnv = (
  env: EnvConfig | undefined,
  key: string,
  data: Record<string, any>
) => {
  if (!env) return;
  const _env = env?.[key];
  if (!_env) throw new Error(`Env config for ${key} was not found.`);
  const parsedEnv = _env.schema.safeParse(data);

  if (!parsedEnv?.success) {
    logger.error(
      "❌ Invalid environment variables:\n",
      ...formatZodErrors(parsedEnv.error.format())
    );
    throw new Error("Invalid environment variables");
  }

  return { ..._env, data: parsedEnv.data };
};
