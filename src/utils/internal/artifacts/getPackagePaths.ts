import { EnvConfig, Server } from "../../../index.js";
import { globToPaths, join } from "../index.js";
import fs from "fs";
import { getArtifactPaths } from "./getArtifactPaths.js";

export const getPackagePaths = async (
  deploy: Server,
  env: EnvConfig | undefined
) => {
  const paths = await getArtifactPaths(deploy, env);

  const packagePaths = [
    ...(await globToPaths(
      [
        ...paths
          .filter((p) => fs.lstatSync(p).isDirectory())
          .map((p) => {
            return join(p, "**/package.json");
          }),
      ],
      { unique: true }
    )),
    ...paths.filter(
      (p) => p.includes("package.json") || p.includes("package-lock.json")
    ),
  ].filter((p) => !p.includes("node_modules"));

  return packagePaths;
};
