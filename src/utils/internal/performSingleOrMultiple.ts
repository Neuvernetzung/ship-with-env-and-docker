import isArray from "lodash/isArray.js";

type PerformSingleOrMultipleOptions = { strict?: boolean };

export const performSingleOrMultiple = <T>(
  dependent: T | T[],
  fn: (values: NonNullable<T>) => any,
  options?: PerformSingleOrMultipleOptions
) => {
  if (isArray(dependent)) {
    const filtered = dependent.filter((v) => v) as NonNullable<T>[];
    if (filtered.length === 0) {
      if (options?.strict) throw new Error();
      return;
    }
    if (options?.strict && filtered.length !== dependent.length)
      throw new Error();
    return filtered.map(fn);
  }

  if (!dependent) {
    if (options?.strict) throw new Error();
    return;
  }
  return fn(dependent);
};
