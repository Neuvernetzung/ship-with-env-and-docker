import { App, Server } from "../../../../types/index.js";
import { stripHttpsFromUrl } from "../../../stripHttpsFromUrl.js";

const EXPOSE_FOLDER_FUNCTION_NAME = "expose_folder";

export const createNginxScript = (deploy: Server) => {
  const filteredApp = deploy.apps.filter((app) => !!app.url) as (Omit<
    App,
    "url"
  > &
    Required<Pick<App, "url">>)[];

  return `
#!/bin/sh

set -e

${filteredApp.map((app) => createDummyScript(app.url)).join("\n\n")}

${deploy.expose_folder ? createDummyScript(deploy.expose_folder.url) : ""}

if [ ! -f /etc/nginx/ssl/ssl-dhparams.pem ]; then
    openssl dhparam -out /etc/nginx/ssl/ssl-dhparams.pem 2048
fi

${filteredApp
  .map((app) => createUseCertificates(app.url, app.name))
  .join("\n\n")}

  ${
    deploy.expose_folder
      ? createUseCertificates(
          deploy.expose_folder.url,
          EXPOSE_FOLDER_FUNCTION_NAME
        )
      : ""
  }

reload_nginx() {
    echo "Reload nginx configuration."
    nginx -s reload
    echo "Nginx configuration reloaded successful."
}

${filteredApp.map((app) => waitForLetsEncrypt(app.url, app.name)).join("\n\n")}

${
  deploy.expose_folder
    ? waitForLetsEncrypt(deploy.expose_folder.url, EXPOSE_FOLDER_FUNCTION_NAME)
    : ""
}

${filteredApp.map((app) => nginxCondition(app.url, app.name)).join("\n\n")}

${
  deploy.expose_folder
    ? nginxCondition(deploy.expose_folder.url, EXPOSE_FOLDER_FUNCTION_NAME)
    : ""
}

exec nginx -g "daemon off;"
`;
};

const createDummyScript = (url: string) => {
  const finalUrl = stripHttpsFromUrl(url);

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

const createUseCertificates = (url: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(url);

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

const waitForLetsEncrypt = (url: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(url);

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

const nginxCondition = (url: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(url);

  return `
    if [ ! -d "/etc/letsencrypt/live/${finalUrl}" ]; then
        ${waitForLetsEncryptFunctionName(name)} "${finalUrl}" &
    else
        ${useCertificatesFunctionName(name)} "${finalUrl}"
    fi`;
};
