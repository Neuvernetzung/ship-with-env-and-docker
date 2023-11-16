import { ServerDeploy } from "../../../../types/deploys";
import { EnvSchemas, Server } from "../../../../types/index";

import { createComposeContent } from "./content";
import { getComposePath } from "./getComposePath";
import { saveComposeFile } from "./save";

export const handleComposeFile = async (
  server: Server,
  deploy: ServerDeploy,
  env: EnvSchemas | undefined,
  dir: string
) => {
  await saveComposeFile(await createComposeContent(server, deploy, env), dir);

  return { path: getComposePath(dir) };
};
