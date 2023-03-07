import { writeFile, readFile } from "fs/promises";
import { CONFIG_DEFAULT_NAME } from "../index.js";

export const GITIGNORE_FILE_PATH = "./.gitignore";

export const updateGitIgnore = async (configName?: string) => {
  const cfgName = configName || CONFIG_DEFAULT_NAME;

  const gitIgnoreFile = await readFile(GITIGNORE_FILE_PATH, "utf8");
  if (!gitIgnoreFile) return;

  if (gitIgnoreFile.includes(cfgName)) return;

  const newGitIgnore = gitIgnoreFile.concat(`\n${cfgName}`);
  await writeFile(GITIGNORE_FILE_PATH, newGitIgnore);
};
