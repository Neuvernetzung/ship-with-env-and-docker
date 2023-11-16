import type { Server } from "@/types/index.js";
import {
  createDockerFileLine,
  dockerFileToString,
  getDockerFilePath,
} from "../../../index.js";
import { getHelpersPath } from "../../getHelpersPath.js";
import type { HelperFile } from "../../handleHelperFiles.js";
import { createNginxScript } from "../script/index.js";
import type { ServerDeploy } from "@/types/deploys.js";
import { createDefaultConf } from "./config.js";
import {
  NGINX_DEFAULT_CONF_NAME,
  NGINX_HSTS_CONF_NAME,
  NGINX_OPTIONS_SSL_CONF_NAME,
  NGINX_PATH,
  NGINX_SCRIPT_NAME,
  nginxBasePath,
  nginxConfigPath,
} from "@/constants/index.js";

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
        `${NGINX_DEFAULT_CONF_NAME} ${nginxConfigPath}`
      ),

      createDockerFileLine(
        "COPY",
        `${NGINX_OPTIONS_SSL_CONF_NAME} ${nginxBasePath}`
      ),

      createDockerFileLine("COPY", `${NGINX_HSTS_CONF_NAME} ${nginxBasePath}`),

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
