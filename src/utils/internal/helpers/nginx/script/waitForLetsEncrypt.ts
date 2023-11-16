import {
  useCertificatesFunctionName,
  waitForLetsEncryptFunctionName,
} from "@/constants";
import { getCertificateLivePath } from "@/constants/certbot/certificate";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl";

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
