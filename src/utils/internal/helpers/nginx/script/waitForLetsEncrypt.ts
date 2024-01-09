import {
  useCertificatesFunctionName,
  waitForLetsEncryptFunctionName,
} from "@/constants/nginx/script.js";
import { getCertificateLivePath } from "@/constants/certbot/certificate.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";
import { ServerDomainConfig } from "@/index.js";

export const waitForLetsEncrypt = (
  domains: ServerDomainConfig,
  name: string
) => {
  const finalUrl = stripHttpsFromUrl(domains.url);
  const certificatePath = getCertificateLivePath(domains.url);

  return `
      ${waitForLetsEncryptFunctionName(name)}() {
          until [ -d "${certificatePath}" ]; do
              echo "Wait for Let's Encrypt certificates for ${finalUrl}."
              sleep 5s & wait \${!}
          done
          ${useCertificatesFunctionName(name)} "${finalUrl}"
          reload_nginx
          }`;
};
