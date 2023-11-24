import isArray from "lodash/isArray.js";
import type { Server, ServerDeploy } from "@/types/index.js";
import { getAppDomain } from "../../../config/domain.js";
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
      const domains = getAppDomain(app, deploy);

      if (!domains)
        throw new Error(
          `There was an error by getting the Apps "${app.name}" Domains. While creating the Nginx script.`
        );

      return {
        name: app.name,
        domain: domains,
      };
    });

  return `
#!/bin/sh

set -e

${appDomains
  .map((app) =>
    isArray(app.domain)
      ? app.domain.map((d) => createDummyScript(d))
      : createDummyScript(app.domain)
  )
  .flat()
  .join("\n\n")}

if [ ! -f ${nginxSSLDHParamsPath} ]; then
    openssl dhparam -out ${nginxSSLDHParamsPath} 2048
fi

${appDomains
  .map((app) =>
    isArray(app.domain)
      ? app.domain.map((d) =>
          createUseCertificates(d, dockerComposeServiceName(app.name))
        )
      : createUseCertificates(app.domain, dockerComposeServiceName(app.name))
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
    isArray(app.domain)
      ? app.domain.map((d) =>
          waitForLetsEncrypt(d, dockerComposeServiceName(app.name))
        )
      : waitForLetsEncrypt(app.domain, dockerComposeServiceName(app.name))
  )
  .flat()
  .join("\n\n")}

${appDomains
  .map((app) =>
    isArray(app.domain)
      ? app.domain.map((d) =>
          nginxCondition(d, dockerComposeServiceName(app.name))
        )
      : nginxCondition(app.domain, dockerComposeServiceName(app.name))
  )
  .flat()
  .join("\n\n")}

exec nginx -g "daemon off;"
`;
};
