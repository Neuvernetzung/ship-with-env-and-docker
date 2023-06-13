import { EnvConfig, Server } from "../../../types/index.js";
import {
  handleHelperFiles,
  handleComposeFile,
  handleDockerFiles,
  clean,
  performSingleOrMultiple,
  removeEnv,
} from "../index.js";
import { writeTar } from "./writeTar.js";
import { mkdir } from "fs/promises";
import { getArtifactPaths } from "./getArtifactPaths.js";

export const LOCAL_DIR = "_swead";

export const createArtifact = async (
  dir: string,
  deploy: Server,
  env: EnvConfig | undefined
) => {
  if (!deploy.artifact) return;

  await mkdir(LOCAL_DIR, { recursive: true }); // Es muss ein Extra Verzeichnis angelegt werden, da wenn Dateien im Temp Ordner gespeichert werden würden, diese dann mit Temp Pfad kopiert werden

  const paths = await getArtifactPaths(deploy, env);

  const helpers = await handleHelperFiles(deploy, LOCAL_DIR);

  const dockerFiles = await handleDockerFiles(deploy, env, LOCAL_DIR);
  const compose = await handleComposeFile(deploy, env, LOCAL_DIR);

  const additionalFiles = [
    compose.path,
    ...(dockerFiles.map((file) => file.path).filter((v) => v) as string[]),
    ...helpers.map((file) => file.path),
  ];

  const finalPaths = paths.concat(additionalFiles);
  await writeTar(dir, finalPaths, deploy.artifact.paths);

  await performSingleOrMultiple(deploy.apps, async (app) => {
    await removeEnv(env, app.env);
  });
  await clean(LOCAL_DIR);
};
