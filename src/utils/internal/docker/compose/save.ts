import { DockerCompose } from "../../../../types/docker.js";
import yaml from "yaml";
import { getComposePath } from "./getComposePath.js";
import { write } from "../../index.js";

export const saveComposeFile = async (
  compose: Partial<DockerCompose>,
  dir: string
) => {
  const yamlContent = yaml.stringify(compose);

  await write(getComposePath(dir), yamlContent);
};
