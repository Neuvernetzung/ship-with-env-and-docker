import set from "lodash/set.js";
import get from "lodash/get.js";
import unset from "lodash/unset.js";

import { SweadConfig } from "../../../index.js";
import { getAllPaths } from "./getAllPaths.js";

export const separateEncryptionData = (config: SweadConfig) => {
  const paths = [
    ...getAllPaths(config, "env"),
    ...getAllPaths(config, "server"),
  ];
  let separatedConfig = { ...config };
  let separatedEncryptionData = {};

  paths.forEach((p) => {
    const value = get(config, p);
    if (!value) return;
    unset(separatedConfig, p);
    set(separatedEncryptionData, p, value);
  });

  return { separatedConfig, separatedEncryptionData };
};
