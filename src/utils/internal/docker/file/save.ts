import { DockerFileContent } from "../../../../types/docker.js";
import { App } from "../../../../types/index.js";
import { getDockerFilePath } from "./getDockerFilePath.js";
import { wrapInQuotes, write } from "../../index.js";
import isArray from "lodash/isArray.js";

export const saveDockerFile = async (
  file: DockerFileContent,
  app: App,
  dir: string
) => {
  const dockerFileContent = dockerFileToString(file);

  await write(getDockerFilePath(dir, app.name), dockerFileContent);
};

export const dockerFileToString = (file: DockerFileContent) =>
  file
    .map(
      (line) =>
        `${line.instruction} ${
          !isArray(line.content)
            ? line.content
            : `[${line.content
                .map((content) => wrapInQuotes(content))
                .join(", ")}]`
        }`
    )
    .join("\n\n");
