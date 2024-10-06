import { z } from "zod";

export type DockerCompose = {
  version: string;
  services: DockerComposeServices;
  volumes: Record<string, DockerComposeVolume>;
  networks?: Record<string, DockerComposeNetwork>;
};

type DockerComposeVolume = object;

type DockerComposeNetwork = { external?: boolean };

export type DockerComposeService = {
  container_name?: string;
  image?: string;
  restart?: string;
  ports?: string[];
  build?: string | { context: string; dockerfile: string };
  env_file?: string[];
  environment?: string[];
  volumes?: string[];
  links?: string[];
  command?: string;
  depends_on?: string[];
  labels?: string[];
};

export type DockerComposeServices = Record<string, DockerComposeService>;

export const DockerFileInstructions = [
  "FROM",
  "RUN",
  "CMD",
  "LABEL",
  "EXPOSE",
  "ENV",
  "ADD",
  "COPY",
  "ENTRYPOINT",
  "VOLUME",
  "USER",
  "WORKDIR",
  "ARG",
  "ONBUILD",
  "STOPSIGNAL",
  "HEALTHCHECK",
  "SHELL",
] as const;

export type DockerFileInstruction = (typeof DockerFileInstructions)[number];

export type DockerFileLine = {
  instruction: DockerFileInstruction;
  content: string | string[];
};

export type DockerFileContent = DockerFileLine[];

export type DockerFile = {
  name: string;
  path?: string;
  content?: DockerFileContent;
};

export type DockerServerRegistry = z.infer<typeof zDockerServerRegistry>;

export const zDockerServerRegistry = z.object({
  url: z.string().url(),
  user: z.string(),
  pass: z.string(),
});

export type DockerServerRegistries = z.infer<typeof zDockerServerRegistries>;

export const zDockerServerRegistries = z.array(zDockerServerRegistry);

export type DockerServerConfig = z.infer<typeof zDockerServerConfig>;

export const zDockerServerConfig = z.object({
  registries: zDockerServerRegistries.optional(),
});

export type DockerConfig = z.infer<typeof zDockerConfig>;

export type DockerWatchtower = z.infer<typeof zDockerWatchtower>;

export const zDockerWatchtower = z.object({
  disabled: z.boolean().optional(),
});

export const zDockerConfig = z.object({
  watchtower: zDockerWatchtower.optional(),
});
