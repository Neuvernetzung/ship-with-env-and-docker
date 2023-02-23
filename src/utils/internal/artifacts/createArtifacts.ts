import { App, Artifact } from "../../../types/config.js";
import { globToPaths } from "../index.js";
import { writeTar } from "./writeTar.js";
import { temporaryDirectory } from "tempy";

export const createArtifacts = async (artifact: Artifact | undefined) => {
  if (!artifact) return;

  const paths = await globToPaths(artifact.paths);

  await writeTar("app.name", paths);
};
