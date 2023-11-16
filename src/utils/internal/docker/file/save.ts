import { DockerFileContent } from "../../../../types/docker";
import { App } from "../../../../types/index";
import { getDockerFilePath } from "./getDockerFilePath";
import { wrapInQuotes, write } from "../../index";
import isArray from "lodash/isArray";

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
