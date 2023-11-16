import {
  useCertificatesFunctionName,
  waitForLetsEncryptFunctionName,
} from "@/constants/nginx/script.js";
import { getCertificateLivePath } from "@/constants/certbot/certificate.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";

export const waitForLetsEncrypt = (domain: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(domain);
  const certificatePath = getCertificateLivePath(domain);

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
