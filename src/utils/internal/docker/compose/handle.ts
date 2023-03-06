import { EnvConfig, Server } from "../../../../types/index.js";

import { createComposeContent } from "./content.js";
import { getComposePath } from "./getComposePath.js";
import { saveComposeFile } from "./save.js";

export const handleComposeFile = async (
  deploy: Server,
  env: EnvConfig | undefined,
  dir: string
) => {
  await saveComposeFile(await createComposeContent(deploy, env), dir);

  return { path: getComposePath(dir) };
};
