import fs from "fs";

export const formatEnvPath = (path: string) => {
  if (path.includes(".env")) return path;
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory())
    return `${path}/.env`;
  return `${path}.env`;
};
