import { ServerDeploy } from "../../../../types/deploys";
import { Certbot, Server } from "../../../../types/index";
import { stripHttpsFromUrl } from "../../../stripHttpsFromUrl";
import {
  createDockerFileLine,
  dockerFileToString,
  getAppDomain,
  getDockerFilePath,
  NGINX_SERVICE_NAME,
} from "../../index";
import { getHelpersPath } from "../getHelpersPath";
import { HelperFile } from "../handleHelperFiles";

export const CERTBOT_PATH = "certbot";

export const CERTBOT_SCRIPT_NAME = "certbot.sh";

export const createCertbotFiles = (
  server: Server,
  deploy: ServerDeploy
): HelperFile[] => {
  const certbotScript: HelperFile = {
    path: getHelpersPath(`${CERTBOT_PATH}/${CERTBOT_SCRIPT_NAME}`),
    content: `#!/bin/bash

    set -e
    
    trap exit INT TERM
    
    until nc -z ${NGINX_SERVICE_NAME} 80; do
      echo "Waiting for nginx to start..."
      sleep 5s & wait \${!}
    done
    
    ${server.apps
      .filter((app) => !!app.requireUrl)
      .map((app) => {
        const domain = getAppDomain(app, deploy);
        if (!domain) return;
        return createCertbotScriptCommand(domain, server.certbot);
      })
      .join("\n\n")}
    
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
