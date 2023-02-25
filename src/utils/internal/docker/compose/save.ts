import { DockerCompose } from "../../../../types/docker.js";
import yaml from "yaml";
import { writeFile } from "fs/promises";
import { getComposePath } from "./getComposePath.js";

export const saveComposeFile = async (
  compose: Partial<DockerCompose>,
  dir: string
) => {
  const yamlContent = yaml.stringify(compose);

  await writeFile(getComposePath(dir), yamlContent);
};
