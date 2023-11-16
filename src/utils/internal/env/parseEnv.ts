import { EnvSchemas } from "../../../types/index";
import { formatZodErrors } from "../zod/index";

export const parseEnv = (
  envSchemas: EnvSchemas | undefined,
  key: string,
  data: Record<string, any>
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
