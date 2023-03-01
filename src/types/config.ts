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

export type DevCommand<T extends EnvConfig = EnvConfig> = {
  name: string;
  env?: EnvEntry<T> | EnvEntry<T>[];
  command: string;
  waitOn?: string | string[];
  open?: string;
  cleanUp?: string | string[];
};

type DevCommandUnion<T extends EnvConfig> = DevCommand<T> | DevCommand<T>[];

type SSH = {
  user: string;
  password: string;
  port?: number;
};

export type ServerDetails = {
  ip: string;
  ssh: SSH;
  path?: string;
  neverClean?: string[];
};

type Build = {
  needs?: string;
  cleanUp?: string | string[];
  beforeFunction?: ((app: App) => void) | ((app: App) => Promise<void>);
  command: string;
  afterFunction?: ((app: App) => void) | ((app: App) => Promise<void>);
};

export type Artifact = {
  paths: string[];
};

type Start = {
  command: string;
};

type Docker = {
  image?: string;
  port?: number;
  volumes?: string[];
  links?: string[];
  workDir?: string;
  environment?: string[];
};

export type Certbot = {
  email?: string;
};

export type App<T extends EnvConfig = EnvConfig> = {
  name: string;
  url?: string;
  env?: EnvEntry<T> | EnvEntry<T>[];
  docker: Docker;
} & BuildUnion;

export type BuildUnion =
  | { build: Build; start: Start }
  | { build?: undefined; start?: undefined };

export type Server<T extends EnvConfig = EnvConfig> = {
  server: ServerDetails;
  apps: App<T>[];
  artifact?: Artifact;
  waitOn?: string | string[];
  beforeStart?: string | string[];
  afterStart?: string | string[];
  certbot?: Certbot;
};

type ServerUnion<T extends EnvConfig> = Server<T> | Server<T>[];

export type Deploy<T extends EnvConfig = EnvConfig> = {
  deploy: ServerUnion<T>;
};

type DeployUnion<T extends EnvConfig> = Deploy<T> | Deploy<T>[];

type Branches = {
  staging?: string;
  production?: string;
};

type LocalBuild = { command: string };

type LocalStart = { command: string };

export type LocalCommand<T extends EnvConfig = EnvConfig> = {
  name: string;
  env?: EnvEntry<T> | EnvEntry<T>[];
  waitOn?: string | string[];
  open?: string;
  cleanUp?: string | string[];
  build?: LocalBuild;
  start?: LocalStart;
};

type LocalCommandUnion<T extends EnvConfig> =
  | LocalCommand<T>
  | LocalCommand<T>[];

export type SweadConfig<T extends EnvConfig = EnvConfig> = {
  dev?: DevCommandUnion<T>;
  local?: LocalCommandUnion<T>;
  staging?: DeployUnion<T>;
  production?: DeployUnion<T>;
  branches?: Branches;
};

export type ConfigFile = {
  config: SweadConfig;
  env?: EnvConfig;
};
