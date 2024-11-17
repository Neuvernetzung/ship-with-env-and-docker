import { Listr, ListrTask, ListrBaseClassOptions } from "listr2";
import isArray from "lodash/isArray.js";
import pMap from "p-map";

export const runTasks = async <C>(
  fns: ListrTask<C> | ListrTask<C>[],
  options?: ListrBaseClassOptions<C>, // Context muss durchgepasst werden, da Typescript sonst nicht sicher ist, wann die funktion läuft und somit checks auf undefined usw. vorher nicht im Type berücksichtigt werden.
  verbose?: boolean
) => {
  const tasks = new Listr<C, "default" | "verbose">(fns, {
    ctx: options?.ctx,
    concurrent: 1,
    rendererOptions: { collapseSubtasks: false },
    renderer: verbose ? "verbose" : "default",
  });

  return await tasks.run();
};

type SingleOrMultipleTasksOptions = {
  strict?: boolean;
};

export const singleOrMultipleTasks = async <T>(
  dependent: T | T[],
  fn: (values: NonNullable<T>, i: number) => Promise<ListrTask>,
  options?: SingleOrMultipleTasksOptions
) => {
  if (isArray(dependent)) {
    const filtered = dependent.filter((v) => v) as NonNullable<T>[];
    if (filtered.length === 0) {
      if (options?.strict) throw new Error(`Array is empty.`);
      return [];
    }
    return await pMap(filtered, fn, { concurrency: 1 });
  }

  if (!dependent) {
    if (options?.strict) throw new Error(`Task is not available.`);
    return [];
  }
  return await fn(dependent, 0);
};
