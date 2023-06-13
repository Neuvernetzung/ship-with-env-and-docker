import compact from "lodash/compact.js";
import { App, EnvConfig, Server } from "../../../index.js";
import { getEnvPaths, globToPaths } from "../index.js";

export const getArtifactPaths = async (
  server: Server,
  env: EnvConfig | undefined
) => {
  if (!server.artifact) return [];

  const artifactPaths = [
    ...(await globToPaths(server.artifact.paths, { unique: true })),
    ...(await globToPaths(
      compact(server.apps.map((app) => app.artifact?.paths)).flat(),
      { unique: true }
    )),
    ...(!server.artifact.excludeEnv ? await getEnvPaths(server.apps, env) : []),
  ];

  return artifactPaths;
};

export const getAppArtifactPaths = async (
  server: Server,
  env: EnvConfig | undefined,
  app: App
) => {
  const artifactPaths = [
    ...(await globToPaths(server.artifact?.paths || [], { unique: true })),
    ...(await globToPaths(app.artifact?.paths || [], { unique: true })),
    ...(!server.artifact?.excludeEnv
      ? await getEnvPaths(server.apps, env)
      : []),
  ];

  return artifactPaths;
};
