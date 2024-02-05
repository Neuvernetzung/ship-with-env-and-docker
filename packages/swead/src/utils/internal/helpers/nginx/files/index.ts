import type { Server } from "@/types/index.js";
import type { HelperFile } from "../../handleHelperFiles.js";
import type { ServerDeploy } from "@/types/deploys.js";
import { createRedirectConfigs } from "./redirects.js";

export const createNginxFiles = (
  server: Server,
  deploy: ServerDeploy
): HelperFile[] => {
  const redirectFiles = createRedirectConfigs(server, deploy);

  return [...redirectFiles];
};
