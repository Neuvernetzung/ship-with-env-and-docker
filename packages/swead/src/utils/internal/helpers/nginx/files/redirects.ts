import {
  nginxCertsDir,
  nginxRedirectHelperFile,
} from "@/constants/nginx/index.js";
import type { Server, ServerDeploy } from "@/types/index.js";
import { getAppDomains } from "@/utils/internal/config/domain.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";
import type { HelperFile } from "../../handleHelperFiles.js";
import compact from "lodash/compact.js";
import { getHelpersPath } from "@/constants/helper/index.js";

export const createRedirectConfigs = (
  server: Server,
  deploy: ServerDeploy
): HelperFile[] => {
  const redirectFiles = compact(
    server.apps.map((app) => {
      const domains = getAppDomains(app, deploy);
      if (!domains?.redirects || domains.redirects.length === 0) return;

      const redirectFile = createRedirectConfig(
        stripHttpsFromUrl(domains.url),
        domains.redirects
      );

      return redirectFile;
    })
  );

  return redirectFiles;
};

export const createRedirectConfig = (
  url: string,
  redirects: string[]
): HelperFile => {
  const redirectConfigs = redirects
    .map((redirect) => redirectConfig(url, redirect))
    .join("\n\n");

  return {
    path: nginxRedirectHelperFile(url),
    content: redirectConfigs,
  };
};

const redirectConfig = (finalUrl: string, redirect: string) => {
  const redirectUrl = stripHttpsFromUrl(redirect);

  return `server {
      listen 80;
      server_name ${redirectUrl};
      return 308 https://${finalUrl}$request_uri;
    }
    
    server {
      listen 443 ssl;
      server_name ${redirectUrl};
      ssl_certificate ${nginxCertsDir}/${redirectUrl}.crt;
      ssl_certificate_key ${nginxCertsDir}/${redirectUrl}.key;
      ssl_dhparam ${nginxCertsDir}/${redirectUrl}.dhparam.pem;
      return 308 https://${finalUrl}$request_uri;
    }`;
};
