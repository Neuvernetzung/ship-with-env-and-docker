import fs from "fs";
import { create, TarOptionsWithAliasesAsyncNoFile } from "tar";
import { getArtifactPath } from "../index.js";
import { logger } from "../index.js";
import path from "path";

export const writeTar = async (
  dir: string,
  paths: string[],
  originalPaths: string[]
) => {
  const artifactPath = getArtifactPath(dir);

  const defaultIgnoreList = ["node_modules", ".turbo", ".git"];

  const defaultOptions: TarOptionsWithAliasesAsyncNoFile = {
    cwd: ".",
    gzip: true,
    filter: (p) =>
      !defaultIgnoreList.some(
        (item) => p.includes(item) && path.basename(p) === path.basename(item)
      ) ||
      originalPaths.some(
        (_p) => p.includes(_p) && path.basename(p) === path.basename(_p)
      ),
    portable: true,
    onwarn: (message, data) => {
      logger.warn(message, data);
    },
  };

  const writeStream = fs.createWriteStream(artifactPath);

  const archiver = create(defaultOptions, paths).pipe(writeStream);

  await new Promise((resolve, reject) => {
    archiver.on("error", (err) => {
      logger.error("There was an error writing the tar archive.");
      reject(err);
    });
    writeStream.on("error", (err) => {
      logger.error("There was an error writing the tar archive.");
      reject(err);
    });
    archiver.on("finish", resolve);
  });
};
