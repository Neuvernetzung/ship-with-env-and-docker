import isArray from "lodash/isArray.js";
import _waitOn from "wait-on";
import { WaitOnOptions } from "wait-on";

export const waitOn = async (
  resources: string | string[] | undefined,
  options?: Omit<WaitOnOptions, "resources">
) => {
  if (!resources) return;
  await _waitOn({
    resources: isArray(resources) ? resources : [resources],
    log: true,
    ...options,
  });
};
