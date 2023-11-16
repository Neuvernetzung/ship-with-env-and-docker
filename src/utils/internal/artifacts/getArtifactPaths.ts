import compact from "lodash/compact";
import { App, EnvSchemas, Server } from "../../../index";
import { getEnvPaths, globToPaths } from "../index";

export const getArtifactPaths = async (
  server: Server,
  env: EnvSchemas | undefined
) => {
  const artifactPaths = [
    ...(await globToPaths(server.artifact?.paths || [], { unique: true })),
    ...(await globToPaths(
      compact(server.apps.map((app) => app.artifact?.paths)).flat(),
      { unique: true }
    )),
    ...(!server.artifact?.excludeEnv
      ? await getEnvPaths(server.apps, env)
      : []),
  ];

  return artifactPaths;
};

export const getAppArtifactPaths = async (
  server: Server,
  env: EnvSchemas | undefined,
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
