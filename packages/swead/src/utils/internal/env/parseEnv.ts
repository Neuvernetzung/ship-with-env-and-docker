import { EnvEntry, EnvSchemas } from "../../../types/index.js";
import { formatZodErrors } from "../zod/index.js";

export const parseEnv = (
  envSchemas: EnvSchemas | undefined,
  key: string,
  data: EnvEntry["data"]
) => {
  if (!envSchemas) return;
  const _env = envSchemas?.[key];
  if (!_env) throw new Error(`Env config for ${key} was not found.`);
  const parsedEnv = _env.safeParse(data);

  if (!parsedEnv?.success) {
    throw new Error(
      `Invalid environment variables:\n${formatZodErrors(
        parsedEnv.error.issues
      )}`
    );
  }

  return { key, data: parsedEnv.data };
};
