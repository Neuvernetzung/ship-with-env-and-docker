import fs from "fs";
import tar from "tar";
import { clean, getArtifactPath } from "../index.js";

export const writeTar = async (dir: string, paths: string[]) => {
  const path = getArtifactPath(dir);

  await clean(path);

  const defaultIgnoreList = ["node_modules"];

  const archiver = tar
    .c(
      {
        gzip: true,
        filter: (path, stat) => {
          return !defaultIgnoreList.includes(path);
        },
      },
      paths
    )
    .pipe(fs.createWriteStream(path));

  archiver.on("error", (err) => {
    throw new Error(`There was an error while packing tar. ${err}`);
  });

  await new Promise((resolve) => archiver.on("finish", resolve));

  return;
};
