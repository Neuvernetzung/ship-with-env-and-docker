import {
  useCertificatesFunctionName,
  waitForLetsEncryptFunctionName,
} from "@/constants";
import { getCertificateLivePath } from "@/constants/certbot/certificate";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl";

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
