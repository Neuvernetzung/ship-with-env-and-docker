import { NGINX_CONF_HELPER_PATH } from "@/constants/index.js";
import { HelperFile } from "../handleHelperFiles.js";

export const createNginxFiles = (): HelperFile[] => {
  const defaultConf: HelperFile = {
    path: NGINX_CONF_HELPER_PATH,
    content: `client_max_body_size 1G;`,
  };

  return [defaultConf];
};
