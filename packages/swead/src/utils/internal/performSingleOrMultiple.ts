import isArray from "lodash/isArray.js";
import pMap from "p-map";

type PerformSingleOrMultipleOptions = { strict?: boolean; title?: string };

export const performSingleOrMultiple = async <T>(
  dependent: T | T[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (values: NonNullable<T>, i?: number) => Promise<any>,
  options?: PerformSingleOrMultipleOptions
) => {
  if (isArray(dependent)) {
    const filtered = dependent.filter((v) => v) as NonNullable<T>[];
    if (filtered.length === 0) {
      if (options?.strict)
        throw new Error(`Array of ${options.title} is empty.`);
      return;
    }
    return await pMap(filtered, fn, { concurrency: 1 });
  }

  if (!dependent) {
    if (options?.strict) throw new Error(`${options.title} is not available.`);
    return;
  }
  return await fn(dependent);
};
