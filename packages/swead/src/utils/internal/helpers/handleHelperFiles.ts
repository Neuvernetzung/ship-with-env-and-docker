import { Server } from "../../../types/index.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { join, write } from "../index.js";
import { ServerDeploy } from "../../../types/deploys.js";
import { createDockerGenFiles } from "./docker-gen/files/index.js";
import { createWatchtowerFiles } from "./watchtower/files/index.js";

export type HelperFile = { path: string; content: string };

export const handleHelperFiles = async (
  server: Server,
  deploy: ServerDeploy,
  dir: string
): Promise<HelperFile[]> => {
  const dockerGenFiles = await createDockerGenFiles();

  const allHelperFiles = [...dockerGenFiles];

  if (!server.docker?.watchtower?.disabled) {
    const watchtowerFiles = createWatchtowerFiles(deploy);

    allHelperFiles.push(...watchtowerFiles);
  }

  await performSingleOrMultiple(allHelperFiles, async (file) => {
    await write(join(dir, file.path), file.content);
  });

  return allHelperFiles.map((file) => ({
    ...file,
    path: join(dir, file.path),
  }));
};
