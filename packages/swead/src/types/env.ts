import { z } from "zod";

type EnvSchema = z.ZodObject<any>;

const zEnvSchema: z.ZodType<EnvSchema> = z.any();

export type ParsedEnv = { key: string; data: Record<string, string> };

export type EnvSchemas = Record<string, EnvSchema>;

export const zEnvSchemas: z.ZodType<EnvSchemas> = z.record(zEnvSchema);

export type EnvEntry<
  T extends EnvSchemas = EnvSchemas,
  K extends keyof T = keyof T
> = K extends keyof T
  ? {
      key: K;
      data: z.infer<T[K]>;
    }
  : never;

export const zEnvEntry: z.ZodType<EnvEntry> = z.object({
  key: z.string(),
  data: zEnvSchema,
});

export type EnvLocalation<T extends EnvSchemas = EnvSchemas> = {
  key: keyof T;
  path: string;
};

export const zEnvLocalation: z.ZodType<EnvLocalation> = z.object({
  key: z.string(),
  path: z.string(),
});

export type EnvLocationUnion<T extends EnvSchemas = EnvSchemas> =
  | EnvLocalation<T>
  | EnvLocalation<T>[];
