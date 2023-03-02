import { z } from "zod";

type EnvSchema = z.ZodObject<any>;

const zEnvSchema: z.ZodType<EnvSchema> = z.any();

export type ParsedEnv = Env & { data: Record<string, string> };

export type Env = {
  path: string;
  schema: EnvSchema;
};

const zEnv: z.ZodType<Env> = z.object({
  path: z.string(),
  schema: zEnvSchema,
});

export type EnvConfig = Record<string, Env>;

export const zEnvConfig: z.ZodType<EnvConfig> = z.record(zEnv);

export type EnvEntry<
  T extends EnvConfig = EnvConfig,
  K extends keyof T = keyof T
> = K extends keyof T
  ? {
      key: K;
      data: z.infer<T[K]["schema"]>;
    }
  : never;

export const zEnvEntry: z.ZodType<EnvEntry> = z.object({
  key: z.string(),
  data: zEnvSchema,
});
