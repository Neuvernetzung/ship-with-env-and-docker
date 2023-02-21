import isArray from "lodash/isArray.js";

type PerformSingleOrMultipleOptions = { strict?: boolean; title?: string };

export const performSingleOrMultiple = async <T>(
  dependent: T | T[],
  fn: (values: NonNullable<T>) => Promise<any>,
  options?: PerformSingleOrMultipleOptions
) => {
  if (isArray(dependent)) {
    const filtered = dependent.filter((v) => v) as NonNullable<T>[];
    if (filtered.length === 0) {
      if (options?.strict)
        throw new Error(`Array of ${options.title} is empty.`);
      return;
    }
    return await Promise.all(filtered.map(fn));
  }

  if (!dependent) {
    if (options?.strict) throw new Error(`${options.title} is not available.`);
    return;
  }
  return await fn(dependent);
};
