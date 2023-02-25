import glob from "fast-glob";
import { Options } from "fast-glob/out/settings.js";
import isArray from "lodash/isArray.js";
import merge from "lodash/merge.js";

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
  } else {
    if (glob.isDynamicPattern(paths)) {
      dynamicPaths.push(paths);
    } else {
      inDynamicPaths.push(paths);
    }
  }

  const globPaths = await glob(
    dynamicPaths,
    merge({ ignore: ["**/node_modules/**"] }, options)
  );

  return [...inDynamicPaths, ...globPaths];
};
