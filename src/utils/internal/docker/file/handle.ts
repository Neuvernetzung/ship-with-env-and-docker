import pMap from "p-map";
import { EnvSchemas, Server } from "../../../../types/index";
import { DockerFile } from "../../../../types/docker";
import { createDockerFileContent } from "./content";
import { getDockerFilePath } from "./getDockerFilePath";
import { saveDockerFile } from "./save";
import { getAppArtifactPaths } from "../../artifacts/getArtifactPaths";
import { getPackagePaths } from "../../artifacts/getPackagePaths";

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
