import { z } from "zod";

type EnvSchema = z.ZodObject<any>;

export type Env = {
  path: string;
  schema: EnvSchema;
};

export type ParsedEnv = Env & { data: Record<string, string> };

export type EnvConfig = Record<string, Env>;

export type EnvEntry<
  T extends EnvConfig = EnvConfig,
  K extends keyof T = keyof T
> = K extends keyof T
  ? {
      key: K;
      data: z.infer<T[K]["schema"]>;
    }
  : never;

export type Command<T extends EnvConfig = EnvConfig> = {
  name: string;
  env?: EnvEntry<T> | EnvEntry<T>[];
  command: string;
  waitOn?: string;
  cacheToClean?: string | string[];
};

type Dev<T extends EnvConfig> = Command<T> | Command<T>[];

export type SweadConfig<T extends EnvConfig = EnvConfig> = {
  dev?: Dev<T>;
  servers: [];
};

export type ConfigFile = {
  config: SweadConfig;
  env?: EnvConfig;
};
