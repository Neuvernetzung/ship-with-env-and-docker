import glob from "fast-glob";
import { Options } from "fast-glob/out/settings.js";
import isArray from "lodash/isArray.js";

export const globToPaths = async (
  paths: string | string[],
  options?: Options
) => {
  const dynamicPaths: string[] = [];
  const inDynamicPaths: string[] = [];

  if (isArray(paths)) {
    paths.forEach((path) => {
      if (glob.isDynamicPattern(path)) {
        dynamicPaths.push(path);
      } else {
        inDynamicPaths.push(path);
      }
    });
  }

  const globPaths = await glob(
    dynamicPaths,
    options || { ignore: ["**/node_modules/**"] }
  );

  return [...inDynamicPaths, ...globPaths];
};
