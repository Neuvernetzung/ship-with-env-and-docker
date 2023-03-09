import { EnvConfig } from "../../../types/index.js";
import { formatZodErrors } from "../zod/index.js";

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
    throw new Error(
      `Invalid environment variables:\n${formatZodErrors(
        parsedEnv.error.issues
      )}`
    );
  }

  return { ..._env, data: parsedEnv.data };
};
