import { z } from "zod";
import { EnvSchemas, EnvLocationUnion, zEnvLocalation } from "./env.js";
import { DockerFileInstructions } from "./docker.js";

export type ServerConfig = z.infer<typeof zServerConfig>;

const zServerConfig = z.object({
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

export type App<T extends EnvSchemas = EnvSchemas> = {
  name: string;
  requireUrl?: boolean;
  env?: EnvLocationUnion<T>;
  docker: Docker;
  artifact?: Artifact;
} & BuildUnion;

const zApp: z.ZodType<App> = z
  .intersection(
    z.object({
      name: z.string(),
      requireUrl: z.boolean().optional(),
      env: z.union([zEnvLocalation, z.array(zEnvLocalation)]).optional(),
      docker: zDocker,
      artifact: zArtifact.optional(),
    }),
    zBuildUnion
  )
  .refine((data) => !!data.build === !!data.start, {
    message: "Start must be defined if the app has a build-step.",
  });

export type Server<T extends EnvSchemas = EnvSchemas> = {
  serverConfig?: ServerConfig;
  apps: App<T>[];
  artifact?: Artifact;
  waitOn?: string | string[];
  beforeStart?: string | string[];
  afterStart?: string | string[];
  attached?: boolean;
  removeDockerImagesBefore?: boolean;
  removeOrphans?: boolean;
  sharedDockerVolumes?: string[];
};

export const zServer: z.ZodType<Server> = z
  .object({
    serverConfig: zServerConfig.optional(),
    apps: z.array(zApp),
    artifact: zArtifact.optional(),
    waitOn: z.union([z.string(), z.array(z.string())]).optional(),
    beforeStart: z.union([z.string(), z.array(z.string())]).optional(),
    afterStart: z.union([z.string(), z.array(z.string())]).optional(),
    attached: z.boolean().optional(),
    removeDockerImagesBefore: z.boolean().optional(),
    removeOrphans: z.boolean().optional(),
    sharedDockerVolumes: z.array(z.string()).optional(),
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
