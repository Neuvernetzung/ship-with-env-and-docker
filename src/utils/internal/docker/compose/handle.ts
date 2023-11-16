import { ServerDeploy } from "../../../../types/deploys.js";
import { EnvSchemas, Server } from "../../../../types/index.js";

import { createComposeContent } from "./content.js";
import { getComposePath } from "./getComposePath.js";
import { saveComposeFile } from "./save.js";

export const handleComposeFile = async (
  server: Server,
  deploy: ServerDeploy,
  env: EnvSchemas | undefined,
  dir: string
) => {
  await saveComposeFile(await createComposeContent(server, deploy, env), dir);

  return { path: getComposePath(dir) };
};
