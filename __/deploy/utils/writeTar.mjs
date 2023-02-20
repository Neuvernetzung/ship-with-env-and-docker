import fs from "fs";
import { coloredConsole } from "./index.mjs";
import tar from "tar";

export const writeTar = async ({ name, paths, ignoreList = [] }) => {
  const archiver = tar
    .c(
      {
        gzip: true,
        filter: (path, stat) => {
          return !ignoreList.includes(path);
        },
      },
      paths
    )
    .pipe(fs.createWriteStream(`./packages/deploy/artifacts/${name}.tgz`));

  archiver.on("error", (err) => {
    return (
      coloredConsole("red", "Es ist ein Fehler beim verpacken aufgetreten."),
      process.exit()
    );
  });

  await new Promise((resolve) => archiver.on("finish", resolve));

  return;
};
