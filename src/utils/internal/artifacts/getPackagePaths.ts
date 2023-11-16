import { App, EnvSchemas, Server } from "../../../index";
import { globToPaths, join } from "../index";
import fs from "fs";
import { getAppArtifactPaths } from "./getArtifactPaths";

export const getPackagePaths = async (
  server: Server,
  env: EnvSchemas | undefined,
  app: App
) => {
  const paths = await getAppArtifactPaths(server, env, app);

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
