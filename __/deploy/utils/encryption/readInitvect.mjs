import fs from "fs";
import path from "path";

export const readInitVect = async ({ file }) => {
  const read = fs.createReadStream(path.join(file + ".enc"), {
    end: 15,
  });

  let initVect;
  read.on("data", (chunk) => {
    initVect = chunk;
  });

  await new Promise((resolve) => read.on("close", resolve));

  return initVect;
};
