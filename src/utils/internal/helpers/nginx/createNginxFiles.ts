import { App, Server } from "../../../../types/index.js";
import { DockerFileInstructions as Inst } from "../../../../types/docker.js";
import { stripHttpsFromUrl } from "../../../stripHttpsFromUrl.js";
import {
  createDockerFileLine,
  dockerFileToString,
  getDockerFilePath,
} from "../../index.js";
import { getHelpersPath } from "../getHelpersPath.js";
import { HelperFile } from "../handleHelperFiles.js";
import { createNginxScript } from "./createNginxScript.js";
import punycode from "punycode";

export const NGINX_PATH = "nginx";

export const NGINX_DEFAULT_CONF_NAME = "default.conf";
export const NGINX_HSTS_CONF_NAME = "hsts.conf";
export const NGINX_SCRIPT_NAME = "nginx.sh";
export const NGINX_OPTIONS_SSL_CONF_NAME = "options-ssl-nginx.conf";

export const createNginxFiles = (deploy: Server): HelperFile[] => {
  const defaultConf: HelperFile = {
    path: getHelpersPath(`${NGINX_PATH}/${NGINX_DEFAULT_CONF_NAME}`),
    content: `server_names_hash_bucket_size 64;
    client_max_body_size 1G;

${(
  deploy.apps.filter((app) => !!app.url) as (Omit<App, "url"> &
    Required<Pick<App, "url">>)[]
)
  .map((app) => createDefaultConf(app))
  .join("\n\n")}
`,
  };

  const nginxDockerFile: HelperFile = {
    path: getHelpersPath(getDockerFilePath(NGINX_PATH)),
    content: dockerFileToString([
      createDockerFileLine(Inst.FROM, "nginx:mainline-alpine"),

      createDockerFileLine(Inst.RUN, "apk add --no-cache openssl"),

      createDockerFileLine(
        Inst.COPY,
        `${NGINX_DEFAULT_CONF_NAME} /etc/nginx/conf.d/`
      ),

      createDockerFileLine(Inst.COPY, `options-ssl-nginx.conf /etc/nginx/`),

      createDockerFileLine(Inst.COPY, `${NGINX_HSTS_CONF_NAME} /etc/nginx/`),

      createDockerFileLine(Inst.COPY, `${NGINX_SCRIPT_NAME} /customization/`),

      createDockerFileLine(
        Inst.RUN,
        `chmod +x /customization/${NGINX_SCRIPT_NAME}`
      ),

      createDockerFileLine(
        Inst.RUN,
        `sed -i 's/\\r//' /customization/${NGINX_SCRIPT_NAME}`
      ), // Fix line ending bugs

      createDockerFileLine(Inst.EXPOSE, "80"),

      createDockerFileLine(Inst.CMD, [`/customization/${NGINX_SCRIPT_NAME}`]),
    ]),
  };

  const hstsConfFile: HelperFile = {
    path: getHelpersPath(`${NGINX_PATH}/${NGINX_HSTS_CONF_NAME}`),
    content: `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`,
  };

  const nginxScriptFile: HelperFile = {
    path: getHelpersPath(`${NGINX_PATH}/${NGINX_SCRIPT_NAME}`),
    content: createNginxScript(deploy),
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

const createDefaultConf = (
  app: Omit<App, "url"> & Required<Pick<App, "url">>
) => {
  const finalUrl = punycode.toASCII(stripHttpsFromUrl(app.url));

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
  listen       443 ssl http2;
  server_name  ${finalUrl};

  ssl_certificate /etc/nginx/ssl/dummy/${finalUrl}/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/dummy/${finalUrl}/privkey.pem;

  include /etc/nginx/options-ssl-nginx.conf;

  ssl_dhparam /etc/nginx/ssl/ssl-dhparams.pem;

  include /etc/nginx/hsts.conf;

  location / {
      proxy_pass http://${app.name}:${app.docker.port};
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
  listen       443 ssl http2;
  server_name  www.${finalUrl};

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
