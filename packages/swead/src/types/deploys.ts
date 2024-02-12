import { z } from "zod";
import { EnvSchemas, EnvEntry, zEnvEntry } from "./env.js";
import { RunMethods } from "./args.js";
import { SweadConfig } from "./config.js";
import { zUrl } from "./url.js";
import { Notification, zNotification } from "./helpers.js";
import { DockerServerConfig, zDockerServerConfig } from "./docker.js";

export type LocalDeploy<T extends EnvSchemas = EnvSchemas> = {
  envs: Array<EnvEntry<T>>;
};

export const zLocalDeploy: z.ZodType<LocalDeploy> = z.object({
  envs: z.array(zEnvEntry),
});

export type SSH = z.infer<typeof zSSH>;

const zSSH = z.object({
  user: z.string(),
  password: z.string(),
  port: z.number().optional(),
});

export type ServerDetails = z.infer<typeof zServerDetails>;

const zServerDetails = z.object({
  ip: z.string(),
  ssh: zSSH,
  path: z.string().optional(),
});

export type Url = string;

export type ServerDomainConfig<TAppName extends string = string> = {
  app: TAppName;
  url: Url;
  redirects?: Url[];
};

export type UseServerConfig<
  TConfig extends SweadConfig = SweadConfig,
  TKey extends keyof TConfig["server"] = keyof TConfig["server"],
> = {
  key: TConfig["server"] extends Record<string, any> ? TKey : string;
  domains: TConfig["server"] extends Record<string, any>
    ? ServerDomainConfig<
        Extract<
          TConfig["server"][TKey]["apps"][number],
          { requireUrl: true }
        >["name"]
      >[]
    : ServerDomainConfig[];
};

const zUseServerConfig: z.ZodType<UseServerConfig> = z.object({
  key: z.string(),
  domains: z.array(
    z.object({
      app: z.string(),
      url: zUrl,
      redirects: z.array(zUrl).optional(),
    })
  ),
});

export type ServerDeploy<
  T extends EnvSchemas = EnvSchemas,
  TConfig extends SweadConfig = SweadConfig,
> = {
  name: string;
  server: ServerDetails;
  envs: Array<EnvEntry<T>>;
  use: UseServerConfig<TConfig>;
  waitOn?: string | string[];
  notifications?: Notification;
  docker?: DockerServerConfig;
};

const zServerDeploy: z.ZodType<ServerDeploy> = z.object({
  name: z.string(),
  server: zServerDetails,
  envs: z.array(zEnvEntry),
  use: zUseServerConfig,
  waitOn: z.union([z.string(), z.array(z.string())]).optional(),
  notifications: zNotification.optional(),
  docker: zDockerServerConfig.optional(),
});

export type ServerDeployUnion<
  T extends EnvSchemas = EnvSchemas,
  TConfig extends SweadConfig = SweadConfig,
> = ServerDeploy<T, TConfig> | ServerDeploy<T, TConfig>[];

export const zServerDeployUnion: z.ZodType<ServerDeployUnion> = z.union([
  zServerDeploy,
  z.array(zServerDeploy),
]);

export type Deploys<
  T extends EnvSchemas = EnvSchemas,
  TConfig extends SweadConfig = SweadConfig,
> = {
  dev?: LocalDeploy<T>;
  local?: LocalDeploy<T>;
  staging?: ServerDeployUnion<T, TConfig>;
  production?: ServerDeployUnion<T, TConfig>;
};

export const zDeploys: z.ZodType<Deploys> = z.object({
  dev: zLocalDeploy.optional(),
  local: zLocalDeploy.optional(),
  staging: zServerDeployUnion.optional(),
  production: zServerDeployUnion.optional(),
});

export type EncryptedDeploys = Partial<Record<RunMethods, string>>;

export const zEncryptedDeploys = z.object({
  dev: z.string().optional(),
  local: z.string().optional(),
  staging: z.string().optional(),
  production: z.string().optional(),
});
