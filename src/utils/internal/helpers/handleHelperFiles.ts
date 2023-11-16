import { Server } from "../../../types/index.js";
import {
  createCertbotFiles,
  createNginxFiles,
  createCronFiles,
} from "./index.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { join, write } from "../index.js";
import { ServerDeploy } from "../../../types/deploys.js";

export type HelperFile = { path: string; content: string };

export const handleHelperFiles = async (
  server: Server,
  deploy: ServerDeploy,
  dir: string
): Promise<HelperFile[]> => {
  const certbotFiles = createCertbotFiles(server, deploy);
  const cronFiles = createCronFiles();
  const nginxFiles = createNginxFiles(server, deploy);

  const allHelperFiles = [...certbotFiles, ...cronFiles, ...nginxFiles];

  await performSingleOrMultiple(allHelperFiles, async (file) => {
    await write(join(dir, file.path), file.content);
  });

  return allHelperFiles.map((file) => ({
    ...file,
    path: join(dir, file.path),
  }));
};
