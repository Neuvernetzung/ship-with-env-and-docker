import path from "path";

export const DOCKER_FILE_NAME_BASE = "Dockerfile";

export const getDockerFilePath = (dir: string, fileName?: string) =>
  path.join(dir, getDockerFileName(fileName));

export const getDockerFileName = (fileName?: string) =>
  !fileName ? DOCKER_FILE_NAME_BASE : `${DOCKER_FILE_NAME_BASE}.${fileName}`;
