import { EnvConfig, Server } from "../../../types/config.js";
import {
  handleHelperFiles,
  globToPaths,
  handleComposeFile,
  handleDockerFiles,
  clean,
  performSingleOrMultiple,
  removeEnv,
  formatEnvPath,
} from "../index.js";
import { writeTar } from "./writeTar.js";
import { mkdir } from "fs/promises";
import isArray from "lodash/isArray.js";
import { getEnvPaths } from "../env/getEnvPaths.js";

export const LOCAL_DIR = "_swead";

export const createArtifact = async (
  dir: string,
  deploy: Server,
  env: EnvConfig | undefined
) => {
  if (!deploy.artifact) return;

  await mkdir(LOCAL_DIR, { recursive: true }); // Es muss ein Extra Verzeichnis angelegt werden, da wenn Dateien im Temp Ordner gespeichert werden würden, diese dann mit Temp Pfad kopiert werden

  const paths = [
    ...(await globToPaths(deploy.artifact.paths)),
    ...(await getEnvPaths(deploy.apps, env)),
  ];

  const helpers = await handleHelperFiles(deploy, LOCAL_DIR);

  const dockerFiles = await handleDockerFiles(deploy.apps, LOCAL_DIR);
  const compose = await handleComposeFile(deploy, env, LOCAL_DIR);

  const additionalFiles = [
    compose.path,
    ...(dockerFiles.map((file) => file.path).filter((v) => v) as string[]),
    ...helpers.map((file) => file.path),
  ];

  const finalPaths = paths.concat(additionalFiles);

  await writeTar(dir, finalPaths);

  await performSingleOrMultiple(deploy.apps, async (app) => {
    await removeEnv(env, app.env);
  });

  await clean(LOCAL_DIR);
};
