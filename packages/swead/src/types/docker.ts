export type DockerCompose = {
  version: string;
  services: DockerComposeServices;
  volumes: Record<string, DockerComposeVolume>;
  networks?: Record<string, DockerComposeNetwork>;
};

type DockerComposeVolume = {};

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
