import { stripHttpsFromUrl } from "@/index.js";
import { join } from "@/utils/internal/files/join.js";
import { getHelpersPath } from "../helper/index.js";

export * from "./docker.js";

export const NGINX_HELPER_NAME = "nginx";

export const NGINX_HELPER_DIR = getHelpersPath(NGINX_HELPER_NAME);

export const nginxRedirectHelperDir = join(NGINX_HELPER_DIR, "redirects");

export const nginxRedirectHelperFile = (url: string) =>
  join(nginxRedirectHelperDir, `${url}.conf`);

export const nginxBasePath = "/etc/nginx";

export const nginxConfigDir = join(nginxBasePath, "conf.d");

export const nginxDefaultConfigPath = join(nginxConfigDir, "default.conf");

export const nginxRedirectConfigDir = join(nginxConfigDir, "redirects");

export const nginxVhostDir = join(nginxBasePath, "vhost.d");

export const nginxHtmlDir = "/usr/share/nginx/html";

export const nginxDhparamsDir = join(nginxBasePath, "dhparam");

export const nginxCertsDir = join(nginxBasePath, "certs");
