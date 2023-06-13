import { z } from "zod";
import { EnvConfig, EnvEntry, zEnvEntry } from "./env.js";
import { Certbot, ExposeFolder, zCertbot, zExposeFolder } from "./helpers.js";
import { DockerFileInstructions } from "./docker.js";
import { zUrl } from "./url.js";

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
});

export type ServerConfig = z.infer<typeof zServerConfig>;

const zServerConfig = z.object({
  path: z.string().optional(),
  neverClean: z.array(z.string()).optional(),
  rebootAfterUpdate: z.boolean().optional(),
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
  excludeEnv: z.boolean().optional(),
});

type Start = z.infer<typeof zStart>;

const zStart = z.object({
  command: z.string(),
});

type Docker = z.infer<typeof zDocker>;

const zDocker = z.object({
  image: z.string().optional(),
  port: z.array(z.number()).optional(),
  volumes: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  workDir: z.string().startsWith("/").optional(),
  environment: z.array(z.string()).optional(),
  command: z.string().optional(),
  skipInstall: z.boolean().optional(),
  copyArtifactOnly: z.boolean().optional(),
  beforeStart: z
    .array(
      z.object({
        instruction: z.enum(DockerFileInstructions),
        content: z.string(),
      })
    )
    .optional(),
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
  artifact?: Artifact;
} & BuildUnion;

const zApp: z.ZodType<App> = z
  .intersection(
    z.object({
      name: z.string(),
      url: zUrl.optional(),
      env: z.union([zEnvEntry, z.array(zEnvEntry)]).optional(),
      docker: zDocker,
      artifact: zArtifact.optional(),
    }),
    zBuildUnion
  )
  .refine((data) => !!data.build === !!data.start, {
    message: "Start must be defined if the app has a build-step.",
  });

export type Server<T extends EnvConfig = EnvConfig> = {
  server?: ServerDetails; // absichtlich optional, damit config auch ohne server wenn verschlüsselt kein Type-Error anzeigt. Wird trotzdem korrekt geparst in zServer
  serverConfig?: ServerConfig;
  apps: App<T>[];
  artifact?: Artifact;
  waitOn?: string | string[];
  beforeStart?: string | string[];
  afterStart?: string | string[];
  certbot?: Certbot;
  exposeFolder?: ExposeFolder;
  attached?: boolean;
  removeDockerImagesBefore?: boolean;
  removeOrphans?: boolean;
};

const zServer: z.ZodType<Server> = z
  .object({
    server: zServerDetails,
    serverConfig: zServerConfig.optional(),
    apps: z.array(zApp),
    artifact: zArtifact.optional(),
    waitOn: z.union([z.string(), z.array(z.string())]).optional(),
    beforeStart: z.union([z.string(), z.array(z.string())]).optional(),
    afterStart: z.union([z.string(), z.array(z.string())]).optional(),
    certbot: zCertbot.optional(),
    exposeFolder: zExposeFolder.optional(),
    attached: z.boolean().optional(),
    removeDockerImagesBefore: z.boolean().optional(),
    removeOrphans: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const ports: number[] = [];
      let noDuplicates = true;
      data.apps.forEach((app) => {
        if (!app.docker.port) return;
        if (ports.find((port) => app.docker.port?.includes(port))) {
          noDuplicates = false;
          return;
        } else {
          ports.push(...app.docker.port);
        }
      });
      return noDuplicates;
    },
    { message: "Multiple apps cannot use the same port" }
  );

type ServerUnion<T extends EnvConfig = EnvConfig> = Server<T> | Server<T>[];

const zServerUnion: z.ZodType<ServerUnion> = z.union([
  zServer,
  z.array(zServer),
]);

export type Deploy<T extends EnvConfig = EnvConfig> = {
  name: string;
  deploy: ServerUnion<T>;
};

const zDeploy: z.ZodType<Deploy> = z.object({
  name: z.string(),
  deploy: zServerUnion,
});

export type DeployUnion<T extends EnvConfig> = Deploy<T> | Deploy<T>[];

export const zDeployUnion = z.union([zDeploy, z.array(zDeploy)]);
