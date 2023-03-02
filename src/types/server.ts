import { z } from "zod";
import { EnvConfig, EnvEntry, zEnvEntry } from "./env.js";
import { Certbot, zCertbot } from "./helpers.js";
import punycode from "punycode";

type SSH = z.infer<typeof zSSH>;

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
  neverClean: z.array(z.string()).optional(),
});

type Build = {
  needs?: string;
  cleanUp?: string | string[];
  beforeFunction?: ((app: App) => void) | ((app: App) => Promise<void>);
  command: string;
  afterFunction?: ((app: App) => void) | ((app: App) => Promise<void>);
};

const zBuild: z.ZodType<Build> = z.object({
  needs: z.string().optional(),
  cleanUp: z.union([z.string(), z.array(z.string())]).optional(),
  beforeFunction: z.function().optional(),
  command: z.string(),
  afterFunction: z.function().optional(),
});

export type Artifact = z.infer<typeof zArtifact>;

const zArtifact = z.object({
  paths: z.array(z.string()),
});

type Start = z.infer<typeof zStart>;

const zStart = z.object({
  command: z.string(),
});

type Docker = z.infer<typeof zDocker>;

const zDocker = z.object({
  image: z.string().optional(),
  port: z.number().optional(),
  volumes: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  workDir: z.string().optional(),
  environment: z.array(z.string()).optional(),
});

export type BuildUnion =
  | { build: Build; start: Start }
  | { build?: undefined; start?: undefined };

const zBuildUnion = z.union([
  z.object({ build: zBuild, start: zStart }),
  z.object({ build: z.undefined(), start: z.undefined() }),
]);

export type App<T extends EnvConfig = EnvConfig> = {
  name: string;
  url?: string;
  env?: EnvEntry<T> | EnvEntry<T>[];
  docker: Docker;
} & BuildUnion;

const zApp: z.ZodType<App> = z
  .intersection(
    z.object({
      name: z.string(),
      url: z
        .string()
        .url()
        .transform((url) => punycode.toASCII(url))
        .optional(),
      env: z.union([zEnvEntry, z.array(zEnvEntry)]).optional(),
      docker: zDocker,
    }),
    zBuildUnion
  )
  .refine((data) => !!data.build === !!data.start, {
    message: "Start must be defined if the app has a build-step.",
  });

export type Server<T extends EnvConfig = EnvConfig> = {
  server: ServerDetails;
  apps: App<T>[];
  artifact?: Artifact;
  waitOn?: string | string[];
  beforeStart?: string | string[];
  afterStart?: string | string[];
  certbot?: Certbot;
};

const zServer: z.ZodType<Server> = z.object({
  server: zServerDetails,
  apps: z.array(zApp),
  artifact: zArtifact.optional(),
  waitOn: z.union([z.string(), z.array(z.string())]).optional(),
  beforeStart: z.union([z.string(), z.array(z.string())]).optional(),
  afterStart: z.union([z.string(), z.array(z.string())]).optional(),
  certbot: zCertbot.optional(),
});

type ServerUnion<T extends EnvConfig = EnvConfig> = Server<T> | Server<T>[];

const zServerUnion: z.ZodType<ServerUnion> = z.union([
  zServer,
  z.array(zServer),
]);

export type Deploy<T extends EnvConfig = EnvConfig> = {
  deploy: ServerUnion<T>;
};

const zDeploy: z.ZodType<Deploy> = z.object({
  deploy: zServerUnion,
});

export type DeployUnion<T extends EnvConfig> = Deploy<T> | Deploy<T>[];

export const zDeployUnion = z.union([zDeploy, z.array(zDeploy)]);
