import { Server, ServerDeploy } from "../../../../types/index";
import { stripHttpsFromUrl } from "../../../stripHttpsFromUrl";
import { dockerComposeServiceName } from "../../docker/compose/serviceName";
import { getAppDomain } from "../../index";

export const createNginxScript = (server: Server, deploy: ServerDeploy) => {
  const appDomains = server.apps
    .filter((app) => app.requireUrl)
    .map((app) => ({
      name: app.name,
      domain: getAppDomain(app, deploy) as string,
    }));

  return `
#!/bin/sh

set -e

${appDomains.map((app) => createDummyScript(app.domain)).join("\n\n")}

if [ ! -f /etc/nginx/ssl/ssl-dhparams.pem ]; then
    openssl dhparam -out /etc/nginx/ssl/ssl-dhparams.pem 2048
fi

${appDomains
  .map((app) =>
    createUseCertificates(app.domain, dockerComposeServiceName(app.name))
  )
  .join("\n\n")}

reload_nginx() {
    echo "Reload nginx configuration."
    nginx -s reload
    echo "Nginx configuration reloaded successful."
}

${appDomains
  .map((app) =>
    waitForLetsEncrypt(app.domain, dockerComposeServiceName(app.name))
  )
  .join("\n\n")}

${appDomains
  .map((app) => nginxCondition(app.domain, dockerComposeServiceName(app.name)))
  .join("\n\n")}

exec nginx -g "daemon off;"
`;
};

const createDummyScript = (domain: string) => {
  const finalUrl = stripHttpsFromUrl(domain);

  return `
    if [ ! -f "/etc/nginx/ssl/dummy/${finalUrl}/fullchain.pem" ]; then
        echo "Generating dummy certificate for ${finalUrl}."
        mkdir -p "/etc/nginx/ssl/dummy/${finalUrl}"
        printf "[dn]\nCN=${finalUrl}\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:${finalUrl}, DNS:www.${finalUrl}\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth" > openssl.cnf
        openssl req -x509 -out "/etc/nginx/ssl/dummy/${finalUrl}/fullchain.pem" -keyout "/etc/nginx/ssl/dummy/${finalUrl}/privkey.pem" \
        -newkey rsa:2048 -nodes -sha256 \
        -subj "/CN=${finalUrl}" -extensions EXT -config openssl.cnf
        rm -f openssl.cnf
        echo "Dummy certificate generation ${finalUrl} successful."
    fi`;
};

const useCertificatesFunctionName = (name: string) =>
  `use_lets_encrypt_${name}_certificates`;

const createUseCertificates = (domain: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(domain);

  return `
    ${useCertificatesFunctionName(name)}() {
        echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für ${finalUrl} eingeleitet." 
        sed -i "s|/etc/nginx/ssl/dummy/${finalUrl}|/etc/letsencrypt/live/${finalUrl}|g" /etc/nginx/conf.d/default.conf
        echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für ${finalUrl} erfolgreich."
        }
    `;
};

const waitForLetsEncryptFunctionName = (name: string) =>
  `wait_for_lets_${name}_encrypt`;

const waitForLetsEncrypt = (domain: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(domain);

  return `
    ${waitForLetsEncryptFunctionName(name)}() {
        until [ -d "/etc/letsencrypt/live/${finalUrl}" ]; do
            echo "Wait for Let's Encrypt certificates for ${finalUrl}."
            sleep 5s & wait \${!}
        done
        ${useCertificatesFunctionName(name)} "${finalUrl}"
        reload_nginx
        }`;
};

const nginxCondition = (domain: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(domain);

  return `
    if [ ! -d "/etc/letsencrypt/live/${finalUrl}" ]; then
        ${waitForLetsEncryptFunctionName(name)} "${finalUrl}" &
    else
        ${useCertificatesFunctionName(name)} "${finalUrl}"
    fi`;
};
