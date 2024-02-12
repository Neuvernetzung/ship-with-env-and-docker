import type { HelperFile } from "../../handleHelperFiles.js";
import type { ServerDeploy } from "@/types/deploys.js";
import { createWatchtowerConfig } from "./config.js";

export const createWatchtowerFiles = (deploy: ServerDeploy): HelperFile[] => {
  if (!deploy.docker?.registries || deploy.docker?.registries.length === 0)
    return [];

  const configFile = createWatchtowerConfig(deploy);

  return [configFile];
};
