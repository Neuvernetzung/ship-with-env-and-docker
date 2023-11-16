import { DockerCompose } from "../../../../types/docker";
import yaml from "yaml";
import { getComposePath } from "./getComposePath";
import { write } from "../../index";

export const saveComposeFile = async (
  compose: Partial<DockerCompose>,
  dir: string
) => {
  const yamlContent = yaml.stringify(compose);

  await write(getComposePath(dir), yamlContent);
};
