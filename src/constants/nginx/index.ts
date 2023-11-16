import { join } from "@/utils/internal/files/join";

export * from "./script";
export * from "./dummyCertificate";
export * from "./docker";

export const NGINX_PATH = "nginx";

export const nginxBasePath = "/etc/nginx";
export const nginxSSLPath = join(nginxBasePath, "ssl");

export const NGINX_SSL_DH_PARAMS_NAME = "ssl-dhparams.pem";

export const nginxSSLDHParamsPath = join(
  nginxSSLPath,
  NGINX_SSL_DH_PARAMS_NAME
);

export const nginxConfigPath = join(nginxBasePath, "conf.d");

export const NGINX_DEFAULT_CONF_NAME = "default.conf";
export const nginxConfigDefaultPath = join(
  nginxConfigPath,
  NGINX_DEFAULT_CONF_NAME
);

export const NGINX_HSTS_CONF_NAME = "hsts.conf";

export const nginxHstsConfigPath = join(nginxBasePath, NGINX_HSTS_CONF_NAME);

export const NGINX_SCRIPT_NAME = "nginx.sh";

export const NGINX_OPTIONS_SSL_CONF_NAME = "options-ssl-nginx.conf";

export const nginxOptionsSSLConfigPath = join(
  nginxBasePath,
  NGINX_OPTIONS_SSL_CONF_NAME
);
