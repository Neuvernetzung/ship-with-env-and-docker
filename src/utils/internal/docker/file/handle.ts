import pMap from "p-map";
import { App, EnvConfig } from "../../../../types/config.js";
import { DockerFile } from "../../../../types/docker.js";
import { createDockerFileContent } from "./content.js";
import { getDockerFilePath } from "./getDockerFilePath.js";
import { saveDockerFile } from "./save.js";

export const handleDockerFiles = async (
  apps: App[],
  dir: string
): Promise<DockerFile[]> => {
  const files = await pMap(apps, async (app) => {
    if (!app.build) return { name: app.name };
    const content = await createDockerFileContent(app);

    await saveDockerFile(content, app, dir);

    return { name: app.name, path: getDockerFilePath(dir, app.name), content };
  });

  return files;
};
