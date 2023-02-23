import isArray from "lodash/isArray.js";
import _waitOn from "wait-on";

export const waitOn = async (resources: string | string[] | undefined) => {
  if (!resources) return;
  await _waitOn({
    resources: isArray(resources) ? resources : [resources],
  });
};
