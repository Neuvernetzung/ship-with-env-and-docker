import {
  useCertificatesFunctionName,
  waitForLetsEncryptFunctionName,
} from "@/constants/index.js";
import { getCertificateLivePath } from "@/constants/certbot/certificate.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";

export const nginxCondition = (domain: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(domain);

  const certificatePath = getCertificateLivePath(finalUrl);

  return `
      if [ ! -d "${certificatePath}" ]; then
          ${waitForLetsEncryptFunctionName(name)} "${finalUrl}" &
      else
          ${useCertificatesFunctionName(name)} "${finalUrl}"
      fi`;
};
