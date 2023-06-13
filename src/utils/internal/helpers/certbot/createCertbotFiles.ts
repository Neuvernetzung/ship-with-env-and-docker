import { App, Certbot, Server } from "../../../../types/index.js";
import { stripHttpsFromUrl } from "../../../stripHttpsFromUrl.js";
import {
  createDockerFileLine,
  dockerFileToString,
  getDockerFilePath,
  NGINX_SERVICE_NAME,
} from "../../index.js";
import { getHelpersPath } from "../getHelpersPath.js";
import { HelperFile } from "../handleHelperFiles.js";

export const CERTBOT_PATH = "certbot";

export const CERTBOT_SCRIPT_NAME = "certbot.sh";

export const createCertbotFiles = (deploy: Server): HelperFile[] => {
  const certbotScript: HelperFile = {
    path: getHelpersPath(`${CERTBOT_PATH}/${CERTBOT_SCRIPT_NAME}`),
    content: `#!/bin/bash

    set -e
    
    trap exit INT TERM
    
    until nc -z ${NGINX_SERVICE_NAME} 80; do
      echo "Waiting for nginx to start..."
      sleep 5s & wait \${!}
    done
    
    ${(
      deploy.apps.filter((app) => !!app.url) as (Omit<App, "url"> &
        Required<Pick<App, "url">>)[]
    )
      .map((app) => createCertbotScriptCommand(app.url, deploy.certbot))
      .join("\n\n")}
    
      ${
        deploy.exposeFolder
          ? createCertbotScriptCommand(deploy.exposeFolder.url, deploy.certbot)
          : ""
      }
      `,
  };

  const certbotDockerFile: HelperFile = {
    path: getHelpersPath(getDockerFilePath(CERTBOT_PATH)),
    content: dockerFileToString([
      createDockerFileLine("FROM", "certbot/certbot"),

      createDockerFileLine("RUN", "apk add --no-cache bash"),

      createDockerFileLine("COPY", `${CERTBOT_SCRIPT_NAME} /opt/`),

      createDockerFileLine("RUN", `chmod +x /opt/${CERTBOT_SCRIPT_NAME}`),

      createDockerFileLine(
        "RUN",
        `sed -i 's/\\r//' /opt/${CERTBOT_SCRIPT_NAME}`
      ), // Fix line ending bugs

      createDockerFileLine("ENTRYPOINT", [`/opt/${CERTBOT_SCRIPT_NAME}`]),
    ]),
  };

  return [certbotScript, certbotDockerFile];
};

const createCertbotScriptCommand = (url: string, certbot?: Certbot) => {
  const finalUrl = stripHttpsFromUrl(url);

  return `if [ -d "/etc/letsencrypt/live/${finalUrl}" ]; then
echo "Let's Encrypt Certificate for ${finalUrl} already exists."
else
echo "Obtaining the certificates for ${finalUrl}"

certbot certonly \
  --webroot \
  -w "/var/www/certbot" \
  --expand \
  -d "${finalUrl}" -d "www.${finalUrl}" \
  ${
    certbot?.email
      ? `--email ${certbot.email}`
      : "--register-unsafely-without-email"
  } \
  --rsa-key-size "4096" \
  --agree-tos \
  --noninteractive || true
fi`;
};
