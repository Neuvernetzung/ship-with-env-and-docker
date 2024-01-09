import type { Server, ServerDeploy } from "@/types/index.js";
import { getAppDomains } from "../../../config/domain.js";
import { dockerComposeServiceName } from "../../../docker/compose/serviceName.js";
import { createDummyScript } from "./dummy.js";
import { createUseCertificates } from "./useCertificate.js";
import { nginxCondition } from "./condition.js";
import { waitForLetsEncrypt } from "./waitForLetsEncrypt.js";
import { nginxSSLDHParamsPath } from "@/constants/nginx/index.js";

export const createNginxScript = (server: Server, deploy: ServerDeploy) => {
  const appDomains = server.apps
    .filter((app) => app.requireUrl)
    .map((app) => {
      const domains = getAppDomains(app, deploy);

      if (!domains)
        throw new Error(
          `There was an error by getting the Apps "${app.name}" Domains. While creating the Nginx script.`
        );

      return {
        name: app.name,
        domains,
      };
    });

  return `
#!/bin/sh

set -e

${appDomains
  .map((app) => createDummyScript(app.domains))
  .flat()
  .join("\n\n")}

if [ ! -f ${nginxSSLDHParamsPath} ]; then
    openssl dhparam -out ${nginxSSLDHParamsPath} 2048
fi

${appDomains
  .map((app) =>
    createUseCertificates(app.domains, dockerComposeServiceName(app.name))
  )
  .flat()
  .join("\n\n")}

reload_nginx() {
    echo "Reload nginx configuration."
    nginx -s reload
    echo "Nginx configuration reloaded successful."
}

${appDomains
  .map((app) =>
    waitForLetsEncrypt(app.domains, dockerComposeServiceName(app.name))
  )
  .flat()
  .join("\n\n")}

${appDomains
  .map((app) => nginxCondition(app.domains, dockerComposeServiceName(app.name)))
  .flat()
  .join("\n\n")}

exec nginx -g "daemon off;"
`;
};
