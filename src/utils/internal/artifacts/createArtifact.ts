import { EnvConfig, Server } from "../../../types/config.js";
import {
  getArtifactPath,
  globToPaths,
  handleComposeFile,
  handleDockerFiles,
} from "../index.js";
import { writeTar } from "./writeTar.js";
import path from "path";

export const createArtifact = async (
  dir: string,
  deploy: Server,
  env: EnvConfig | undefined
) => {
  if (!deploy.artifact) return;

  const paths = await globToPaths(deploy.artifact.paths);

  const dockerFiles = await handleDockerFiles(deploy.apps, dir);
  const compose = await handleComposeFile(deploy, env, dir);

  const additionalFiles = [
    compose.path,
    ...(dockerFiles.map((file) => file.path).filter((v) => v) as string[]),
  ];

  await writeTar(
    dir,
    additionalFiles.map((p) => path.relative(dir, p)),
    "Docker",
    { cwd: dir }
  ); // Tar Datei für Dockerfiles schreiben, path.relative wird benötigt, damit nicht kompletter Temp order geprefixt wird.

  paths.push(`@${getArtifactPath(dir, "Docker")}`); // mit @ werden Tar Dateien der Docker.tgz in die finale Artefact.tgz kopiert

  await writeTar(dir, paths);
};
