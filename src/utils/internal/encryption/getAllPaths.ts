import isObject from "lodash/isObject.js";

export const getAllPaths = (
  obj: Record<string, any>,
  key: string,
  prev = ""
): string[] => {
  const result: string[] = [];

  (obj && (Object.keys(obj) as string[]))?.map((k) => {
    const path = (prev ? `${prev}.` : "") + k;

    if (k === key) {
      result.push(path);
    } else if (isObject(obj[k])) {
      result.push(...getAllPaths(obj[k], key, path));
    }

    return null;
  });

  return result;
};
