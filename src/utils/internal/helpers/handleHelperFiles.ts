import { Server } from "../../../types/index";
import { createCertbotFiles, createNginxFiles, createCronFiles } from "./index";
import { performSingleOrMultiple } from "../performSingleOrMultiple";
import { join, write } from "../index";
import { ServerDeploy } from "../../../types/deploys";

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
