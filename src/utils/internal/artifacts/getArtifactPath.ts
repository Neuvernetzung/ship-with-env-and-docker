import path from "path";

export const ARTIFACT_NAME = "Artifact.tgz";

export const getArtifactPath = (dir: string) => path.join(dir, ARTIFACT_NAME);
