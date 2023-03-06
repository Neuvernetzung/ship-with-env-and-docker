import { readFile, writeFile } from "fs/promises";

export const PACKAGE_JSON_NAME = "package.json";

export const getPkgJson = async () => {
  const pkgJson = JSON.parse(await readFile(PACKAGE_JSON_NAME, "utf8"));

  return pkgJson;
};

export const writePkgJson = async (json: object) => {
  await writeFile(PACKAGE_JSON_NAME, JSON.stringify(json, null, 2));
};
