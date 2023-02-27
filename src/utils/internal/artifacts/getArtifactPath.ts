import path from "path";
import { join } from "../index.js";

export const ARTIFACT_NAME = "Artifact";

export const getArtifactName = (name?: string) =>
  `${name || ARTIFACT_NAME}.tgz`;

export const getArtifactPath = (dir: string, name?: string) =>
  join(dir, getArtifactName(name));
