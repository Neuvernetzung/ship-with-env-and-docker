import {
  certbotBasePath,
  nginxHstsConfigPath,
  nginxOptionsSSLConfigPath,
  nginxSSLDHParamsPath,
} from "@/constants/index.js";
import {
  NGINX_FULL_CHAIN_FILE_NAME,
  NGINX_PRIVATE_KEY_FILE_NAME,
  getDummyCertificatePath,
} from "@/constants/nginx/index.js";
import type { App, ServerDeploy } from "@/types/index.js";
import { getAppDomain } from "@/utils/internal/config/domain.js";
import { dockerComposeServiceName } from "@/utils/internal/docker/compose/serviceName.js";
import { join } from "@/utils/internal/files/join.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";
import isArray from "lodash/isArray.js";

export const createDefaultConf = (app: App, deploy: ServerDeploy) => {
  const domain = getAppDomain(app, deploy);
  if (!domain) return;

  const finalUrl = isArray(domain)
    ? domain.map((u) => stripHttpsFromUrl(u))
    : stripHttpsFromUrl(domain);

  return isArray(finalUrl)
    ? finalUrl.map((url) => serverConfig(app, url)).join("\n\n")
    : serverConfig(app, finalUrl);
};

const serverConfig = (app: App, url: string) => {
  const dummyPath = getDummyCertificatePath(url);

  return `server {
    listen 80;
  
    server_name ${url};
  
    location /.well-known/acme-challenge/ {
        allow all;
        root ${certbotBasePath};
    }
  
    location / {
        return 301 https://$host$request_uri;
    }
  }
  
  server {
    listen       443 ssl;
    server_name  ${url};
    
    http2        on;
  
    ssl_certificate ${join(dummyPath, NGINX_FULL_CHAIN_FILE_NAME)};
    ssl_certificate_key ${join(dummyPath, NGINX_PRIVATE_KEY_FILE_NAME)};
  
    include ${nginxOptionsSSLConfigPath};
  
    ssl_dhparam ${nginxSSLDHParamsPath};
  
    include ${nginxHstsConfigPath};
  
    location / {
        proxy_pass http://${dockerComposeServiceName(app.name)}:${
          app.docker.port
        };
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
  }`;
};
