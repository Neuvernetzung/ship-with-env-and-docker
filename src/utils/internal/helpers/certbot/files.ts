import isArray from "lodash/isArray";
import type { ServerDeploy } from "../../../../types/deploys";
import type { Server } from "../../../../types/index";
import { getAppDomain } from "../../config/domain";
import {
  createCertbotScriptCommand,
  createDockerFileLine,
  dockerFileToString,
  getDockerFilePath,
} from "../../index";
import { getHelpersPath } from "../getHelpersPath";
import { HelperFile } from "../handleHelperFiles";
import {
  CERTBOT_PATH,
  CERTBOT_SCRIPT_NAME,
  NGINX_SERVICE_NAME,
} from "@/constants";

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

        if (isArray(domain)) {
          if (domain.length === 0)
            throw new Error(
              `While creating cert scripts for App "${app.name}" there are no domains specified in array.`
            );

          return domain.map((d) =>
            createCertbotScriptCommand(d, server.certbot)
          );
        }

        if (!domain)
          throw new Error(
            `While creating cert scripts for App "${app.name}" there is no domain specified.`
          );

        return createCertbotScriptCommand(domain, server.certbot);
      })
      .flat()
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
