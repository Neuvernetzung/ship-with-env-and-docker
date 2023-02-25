export type DockerCompose = {
  version: string;
  services: DockerComposeServices;
  volumes: Record<string, object>;
};

export type DockerComposeServices = Record<string, object>;

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
