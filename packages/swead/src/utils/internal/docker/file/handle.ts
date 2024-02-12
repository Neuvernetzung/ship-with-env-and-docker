import pMap from "p-map";
import { EnvSchemas, Server } from "../../../../types/index.js";
import { DockerFile } from "../../../../types/docker.js";
import { createDockerFileContent } from "./content.js";
import { getDockerFilePath } from "./getDockerFilePath.js";
import { saveDockerFile } from "./save.js";
import { getAppArtifactPaths } from "../../artifacts/getArtifactPaths.js";
import { getPackagePaths } from "../../artifacts/getPackagePaths.js";

export const handleDockerFiles = async (
  server: Server,
  env: EnvSchemas | undefined,
  dir: string
): Promise<DockerFile[]> => {
  const files = await pMap(server.apps, async (app) => {
    if (!app.build) return { name: app.name };

    const appArtifactPaths = await getAppArtifactPaths(server, env, app);

    const packagePaths = await getPackagePaths(server, env, app);

    const content = await createDockerFileContent(
      app,
      packagePaths,
      appArtifactPaths
    );

    await saveDockerFile(content, app, dir);

    return { name: app.name, path: getDockerFilePath(dir, app.name), content };
  });

  return files;
};
