import { Artifact } from "../../../types/config.js";
import { globToPaths } from "../index.js";
import { writeTar } from "./writeTar.js";

export const createArtifact = async (
  dir: string,
  artifact: Artifact | undefined
) => {
  if (!artifact) return;

  const paths = await globToPaths(artifact.paths);

  await writeTar(dir, paths);
};
