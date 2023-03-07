import { Server } from "../../../types/index.js";
import {
  createCertbotFiles,
  createNginxFiles,
  createCronFiles,
} from "./index.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { join, write } from "../index.js";

export type HelperFile = { path: string; content: string };

export const handleHelperFiles = async (
  deploy: Server,
  dir: string
): Promise<HelperFile[]> => {
  const certbotFiles = createCertbotFiles(deploy);
  const cronFiles = createCronFiles();
  const nginxFiles = createNginxFiles(deploy);

  const allHelperFiles = [...certbotFiles, ...cronFiles, ...nginxFiles];

  await performSingleOrMultiple(allHelperFiles, async (file) => {
    await write(join(dir, file.path), file.content);
  });

  return allHelperFiles.map((file) => ({
    ...file,
    path: join(dir, file.path),
  }));
};
