import { join } from "@/utils/internal/files/join.js";
import { getHelpersPath } from "../helper/index.js";

export * from "./docker.js";

export const NGINX_HELPER_NAME = "nginx";

export const NGINX_HELPER_DIR = getHelpersPath(NGINX_HELPER_NAME);

export const nginxRedirectConfigName = "redirects.conf";

export const nginxRedirectHelperFile = join(
  NGINX_HELPER_DIR,
  nginxRedirectConfigName
);

export const nginxBasePath = "/etc/nginx";

export const nginxConfigDir = join(nginxBasePath, "conf.d");

export const nginxDefaultConfigPath = join(nginxConfigDir, "default.conf");

export const nginxRedirectConfigPath = join(
  nginxConfigDir,
  nginxRedirectConfigName
);

export const nginxVhostDir = join(nginxBasePath, "vhost.d");

export const nginxHtmlDir = "/usr/share/nginx/html";

export const nginxDhparamsDir = join(nginxBasePath, "dhparam");

export const nginxCertsDir = join(nginxBasePath, "certs");
