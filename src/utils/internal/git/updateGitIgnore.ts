import { writeFile, readFile } from "fs/promises";
import { SWEAD_BASE_PATH, join } from "../index.js";
import { DEPLOYS_FILE_NAME } from "../deploy/loadDeploy.js";

export const GITIGNORE_FILE_PATH = "./.gitignore";

export const updateGitIgnore = async (configName?: string) => {
  const sweadBasePath = configName || SWEAD_BASE_PATH;

  const deploysPath = join(sweadBasePath, DEPLOYS_FILE_NAME);

  const gitIgnoreFile = await readFile(GITIGNORE_FILE_PATH, "utf8");
  if (!gitIgnoreFile) return;

  if (gitIgnoreFile.includes(deploysPath)) return;

  const newGitIgnore = gitIgnoreFile.concat(`\n${deploysPath}`);
  await writeFile(GITIGNORE_FILE_PATH, newGitIgnore);
};
