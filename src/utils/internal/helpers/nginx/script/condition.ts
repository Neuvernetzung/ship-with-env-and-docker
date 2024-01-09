import {
  useCertificatesFunctionName,
  waitForLetsEncryptFunctionName,
} from "@/constants/index.js";
import { getCertificateLivePath } from "@/constants/certbot/certificate.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";
import { ServerDomainConfig } from "@/index.js";

export const nginxCondition = (domains: ServerDomainConfig, name: string) => {
  const finalUrl = stripHttpsFromUrl(domains.url);

  const certificatePath = getCertificateLivePath(finalUrl);

  return `
      if [ ! -d "${certificatePath}" ]; then
          ${waitForLetsEncryptFunctionName(name)} "${finalUrl}" &
      else
          ${useCertificatesFunctionName(name)} "${finalUrl}"
      fi`;
};
