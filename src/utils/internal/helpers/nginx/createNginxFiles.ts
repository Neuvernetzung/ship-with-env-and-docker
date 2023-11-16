import { App, Server } from "../../../../types/index";
import { stripHttpsFromUrl } from "../../../stripHttpsFromUrl";
import {
  createDockerFileLine,
  dockerFileToString,
  getAppDomain,
  getDockerFilePath,
} from "../../index";
import { getHelpersPath } from "../getHelpersPath";
import { HelperFile } from "../handleHelperFiles";
import { createNginxScript } from "./createNginxScript";
import { dockerComposeServiceName } from "../../docker/compose/serviceName";
import { ServerDeploy } from "../../../../types/deploys";

export const NGINX_PATH = "nginx";

export const NGINX_DEFAULT_CONF_NAME = "default.conf";
export const NGINX_HSTS_CONF_NAME = "hsts.conf";
export const NGINX_SCRIPT_NAME = "nginx.sh";
export const NGINX_OPTIONS_SSL_CONF_NAME = "options-ssl-nginx.conf";

export const createNginxFiles = (
  server: Server,
  deploy: ServerDeploy
): HelperFile[] => {
  const defaultConf: HelperFile = {
    path: getHelpersPath(`${NGINX_PATH}/${NGINX_DEFAULT_CONF_NAME}`),
    content: `server_names_hash_bucket_size 64;
client_max_body_size 1G;

${server.apps
  .filter((app) => !!app.requireUrl)
  .map((app) => createDefaultConf(app, deploy))
  .join("\n\n")}
`,
  };

  const nginxDockerFile: HelperFile = {
    path: getHelpersPath(getDockerFilePath(NGINX_PATH)),
    content: dockerFileToString([
      createDockerFileLine("FROM", "nginx:mainline-alpine"),

      createDockerFileLine("RUN", "apk add --no-cache openssl"),

      createDockerFileLine(
        "COPY",
        `${NGINX_DEFAULT_CONF_NAME} /etc/nginx/conf.d/`
      ),

      createDockerFileLine("COPY", `options-ssl-nginx.conf /etc/nginx/`),

      createDockerFileLine("COPY", `${NGINX_HSTS_CONF_NAME} /etc/nginx/`),

      createDockerFileLine("COPY", `${NGINX_SCRIPT_NAME} /customization/`),

      createDockerFileLine(
        "RUN",
        `chmod +x /customization/${NGINX_SCRIPT_NAME}`
      ),

      createDockerFileLine(
        "RUN",
        `sed -i 's/\\r//' /customization/${NGINX_SCRIPT_NAME}`
      ), // Fix line ending bugs

      createDockerFileLine("EXPOSE", "80"),

      createDockerFileLine("CMD", [`/customization/${NGINX_SCRIPT_NAME}`]),
    ]),
  };

  const hstsConfFile: HelperFile = {
    path: getHelpersPath(`${NGINX_PATH}/${NGINX_HSTS_CONF_NAME}`),
    content: `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`,
  };

  const nginxScriptFile: HelperFile = {
    path: getHelpersPath(`${NGINX_PATH}/${NGINX_SCRIPT_NAME}`),
    content: createNginxScript(server, deploy),
  };

  const nginxOptionsSslFile: HelperFile = {
    path: getHelpersPath(`${NGINX_PATH}/${NGINX_OPTIONS_SSL_CONF_NAME}`),
    content: `
    ssl_session_cache shared:le_nginx_SSL:10m;
    ssl_session_timeout 1440m;
    ssl_session_tickets off;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    
    ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
    `,
  };

  return [
    defaultConf,
    nginxDockerFile,
    hstsConfFile,
    nginxScriptFile,
    nginxOptionsSslFile,
  ];
};

const createDefaultConf = (app: App, deploy: ServerDeploy) => {
  const domain = getAppDomain(app, deploy);
  if (!domain) return;

  const finalUrl = stripHttpsFromUrl(domain);

  return `server {
  listen 80;

  server_name ${finalUrl};

  location /.well-known/acme-challenge/ {
      allow all;
      root /var/www/certbot;
  }

  location / {
      return 301 https://$host$request_uri;
  }
}

server {
  listen       443 ssl;
  server_name  ${finalUrl};
  
  http2        on;

  ssl_certificate /etc/nginx/ssl/dummy/${finalUrl}/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/dummy/${finalUrl}/privkey.pem;

  include /etc/nginx/options-ssl-nginx.conf;

  ssl_dhparam /etc/nginx/ssl/ssl-dhparams.pem;

  include /etc/nginx/hsts.conf;

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
}

server {
  listen 80;

  server_name www.${finalUrl};

  location /.well-known/acme-challenge/ {
      allow all;
      root /var/www/certbot;
  }

  location / {
      return 301 https://${finalUrl}$request_uri;
  }
}

server {
  listen       443 ssl;
  server_name  www.${finalUrl};
  
  http2        on;

  ssl_certificate /etc/nginx/ssl/dummy/${finalUrl}/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/dummy/${finalUrl}/privkey.pem;

  include /etc/nginx/options-ssl-nginx.conf;

  ssl_dhparam /etc/nginx/ssl/ssl-dhparams.pem;

  include /etc/nginx/hsts.conf;

  location / {
      return 301 https://${finalUrl}$request_uri;
  }
}`;
};
