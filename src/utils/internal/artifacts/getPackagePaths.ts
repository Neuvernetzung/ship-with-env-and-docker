import { App, EnvConfig, Server } from "../../../index.js";
import { globToPaths, join } from "../index.js";
import fs from "fs";
import { getAppArtifactPaths } from "./getArtifactPaths.js";

export const getPackagePaths = async (
  deploy: Server,
  env: EnvConfig | undefined,
  app: App
) => {
  const paths = await getAppArtifactPaths(deploy, env, app);

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
