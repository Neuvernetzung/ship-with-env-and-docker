import glob from "fast-glob";
import { Options } from "fast-glob/out/settings";
import isArray from "lodash/isArray";

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

  const globPaths = await glob(dynamicPaths, options);

  return [...inDynamicPaths, ...globPaths];
};
