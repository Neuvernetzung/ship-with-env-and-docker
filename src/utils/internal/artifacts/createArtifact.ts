import { EnvSchemas, Server } from "../../../types/index.js";
import {
  handleHelperFiles,
  handleComposeFile,
  handleDockerFiles,
  clean,
  performSingleOrMultiple,
  removeEnv,
  join,
  SWEAD_BASE_PATH,
} from "../index.js";
import { writeTar } from "./writeTar.js";
import { mkdir } from "fs/promises";
import { getArtifactPaths } from "./getArtifactPaths.js";
import compact from "lodash/compact.js";
import { ServerDeploy } from "../../../types/deploys.js";

export const LOCAL_ARTIFACT_DIR = join(SWEAD_BASE_PATH, "_artifact");

export const createArtifact = async (
  dir: string,
  server: Server,
  deploy: ServerDeploy,
  env: EnvSchemas | undefined
) => {
  await mkdir(LOCAL_ARTIFACT_DIR, { recursive: true }); // Es muss ein Extra Verzeichnis angelegt werden, da wenn Dateien im Temp Ordner gespeichert werden würden, diese dann mit Temp Pfad kopiert werden

  const paths = await getArtifactPaths(server, env);

  const helpers = await handleHelperFiles(server, deploy, LOCAL_ARTIFACT_DIR);

  const dockerFiles = await handleDockerFiles(server, env, LOCAL_ARTIFACT_DIR);
  const compose = await handleComposeFile(
    server,
    deploy,
    env,
    LOCAL_ARTIFACT_DIR
  );

  const additionalFiles = [
    compose.path,
    ...(dockerFiles.map((file) => file.path).filter((v) => v) as string[]),
    ...helpers.map((file) => file.path),
  ];

  const finalPaths = paths.concat(additionalFiles);
  await writeTar(dir, finalPaths, [
    ...(server.artifact?.paths || []),
    ...compact(server.apps.map((app) => app.artifact?.paths).flat()),
  ]);

  await performSingleOrMultiple(server.apps, async (app) => {
    await removeEnv(app.env);
  });
  await clean(LOCAL_ARTIFACT_DIR);
};
