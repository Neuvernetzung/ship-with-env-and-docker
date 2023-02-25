import { DockerFileContent } from "../../../../types/docker.js";
import { writeFile } from "fs/promises";
import { App } from "../../../../types/config.js";
import { getDockerFilePath } from "./getDockerFilePath.js";

export const saveDockerFile = async (
  file: DockerFileContent,
  app: App,
  dir: string
) => {
  const dockerFileContent = dockerFileToString(file);
  console.log(dockerFileContent);

  await writeFile(getDockerFilePath(dir, app.name), dockerFileContent);
};

const dockerFileToString = (file: DockerFileContent) =>
  file.map((line) => `${line.instruction} ${line.content}`).join("\n\n");
