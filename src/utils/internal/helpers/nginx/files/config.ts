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
import { getAppDomains } from "@/utils/internal/config/domain.js";
import { dockerComposeServiceName } from "@/utils/internal/docker/compose/serviceName.js";
import { join } from "@/utils/internal/files/join.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";

export const createDefaultConf = (app: App, deploy: ServerDeploy) => {
  const domains = getAppDomains(app, deploy);
  if (!domains) return;

  const finalUrl = stripHttpsFromUrl(domains.url);

  const redirectConfigs = domains.redirects
    ? domains.redirects
        .map((redirect) => redirectConfig(app, finalUrl, redirect))
        .join("\n\n")
    : undefined;

  return `${serverConfig(app, finalUrl)} ${
    redirectConfigs ? `\n\n${redirectConfigs}` : ""
  }`;
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

const redirectConfig = (app: App, finalUrl: string, redirect: string) => {
  const dummyPath = getDummyCertificatePath(redirect);
  const redirectUrl = stripHttpsFromUrl(redirect);

  return `server {
    listen 80;
  
    server_name ${redirectUrl};
  
    location /.well-known/acme-challenge/ {
        allow all;
        root ${certbotBasePath};
    }
  
    location / {
        return 301 https://${finalUrl}$request_uri;
    }
  }
  
  server {
    listen       443 ssl;
    server_name  ${redirectUrl};
    
    http2        on;
  
    ssl_certificate ${join(dummyPath, NGINX_FULL_CHAIN_FILE_NAME)};
    ssl_certificate_key ${join(dummyPath, NGINX_PRIVATE_KEY_FILE_NAME)};
  
    include ${nginxOptionsSSLConfigPath};
  
    ssl_dhparam ${nginxSSLDHParamsPath};
  
    include ${nginxHstsConfigPath};
  
    location / {
        return 301 https://${finalUrl}$request_uri;
    }
  }`;
};
