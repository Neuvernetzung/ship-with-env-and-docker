import fs from "fs";

export const formatEnvPath = (path: string) => {
  if (path.includes(".env")) return path;
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory())
    return `${path}${path.slice(-1) === "/" ? "" : "/"}.env`;
  return `${path}.env`;
};
