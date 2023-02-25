import fs from "fs";
import tar from "tar";
import { clean, getArtifactPath } from "../index.js";
import { logger } from "../logger.js";
import merge from "lodash/merge.js";

export const writeTar = async (
  dir: string,
  paths: string[],
  name?: string,
  options?: tar.CreateOptions
) => {
  const path = getArtifactPath(dir, name);

  await clean(path);

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

  const archiver = tar
    .c(merge(defaultOptions, options), paths)
    .pipe(fs.createWriteStream(path));

  archiver.on("error", (err) => {
    throw new Error(`There was an error while packing tar. ${err}`);
  });

  await new Promise((resolve) => archiver.on("finish", resolve));

  return;
};
