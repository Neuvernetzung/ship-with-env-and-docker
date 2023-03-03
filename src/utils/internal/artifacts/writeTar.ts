import fs from "fs";
import tar from "tar";
import { getArtifactPath } from "../index.js";
import { logger } from "../index.js";
import merge from "lodash/merge.js";

export const writeTar = async (
  dir: string,
  paths: string[],
  name?: string,
  options?: tar.CreateOptions
) => {
  const path = getArtifactPath(dir, name);

  const defaultIgnoreList = ["node_modules", ".turbo", ".git"];

  const defaultOptions: tar.CreateOptions = {
    cwd: ".",
    gzip: true,
    filter: (path) => {
      return !defaultIgnoreList.includes(path);
    },
    portable: true,
    onwarn: (message, data) => {
      logger.warn(message, data);
    },
  };

  const writeStream = fs.createWriteStream(path);

  const archiver = tar
    .c(merge(defaultOptions, options), paths)
    .pipe(writeStream);

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
