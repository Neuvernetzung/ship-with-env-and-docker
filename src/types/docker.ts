export type DockerCompose = {
  version: string;
  services: DockerComposeServices;
  volumes: Record<string, DockerComposeVolume>;
};

type DockerComposeVolume = {};

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
};

export type DockerComposeServices = Record<string, DockerComposeService>;

export enum DockerFileInstructions {
  FROM = "FROM",
  RUN = "RUN",
  CMD = "CMD",
  LABEL = "LABEL",
  EXPOSE = "EXPOSE",
  ENV = "ENV",
  ADD = "ADD",
  COPY = "COPY",
  ENTRYPOINT = "ENTRYPOINT",
  VOLUME = "VOLUME",
  USER = "USER",
  WORKDIR = "WORKDIR",
  ARG = "ARG",
  ONBUILD = "ONBUILD",
  STOPSIGNAL = "STOPSIGNAL",
  HEALTHCHECK = "HEALTCHECK",
  SHELL = "SHELL",
}

export type DockerFileLine = {
  instruction: DockerFileInstructions;
  content: string | string[];
};

export type DockerFileContent = DockerFileLine[];

export type DockerFile = {
  name: string;
  path?: string;
  content?: DockerFileContent;
};
