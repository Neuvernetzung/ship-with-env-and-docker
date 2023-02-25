import path from "path";

export const ARTIFACT_NAME = "Artifact";

export const getArtifactName = (name?: string) =>
  `${name || ARTIFACT_NAME}.tgz`;

export const getArtifactPath = (dir: string, name?: string) =>
  path.join(dir, getArtifactName(name));
