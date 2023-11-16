import { join } from "../../index";

export const DOCKER_FILE_NAME_BASE = "Dockerfile";

export const getDockerFilePath = (dir: string, fileName?: string) =>
  join(dir, getDockerFileName(fileName));

export const getDockerFileName = (fileName?: string) =>
  !fileName
    ? DOCKER_FILE_NAME_BASE
    : `${DOCKER_FILE_NAME_BASE}.${fileName.replace(" ", "-")}`;
