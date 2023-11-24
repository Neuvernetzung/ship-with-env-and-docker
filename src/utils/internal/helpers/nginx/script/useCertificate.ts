import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";
import {
  nginxConfigDefaultPath,
  useCertificatesFunctionName,
} from "@/constants/nginx/index.js";
import { getDummyCertificatePath } from "@/constants/nginx/index.js";
import { getCertificateLivePath } from "@/constants/certbot/certificate.js";

export const createUseCertificates = (domain: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(domain);

  const dummyPath = getDummyCertificatePath(domain);
  const certificatePath = getCertificateLivePath(domain);

  return `
      ${useCertificatesFunctionName(name)}() {
          echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für ${finalUrl} eingeleitet." 
          sed -i "s|${dummyPath}|${certificatePath}|g" ${nginxConfigDefaultPath}
          echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für ${finalUrl} erfolgreich."
          }
      `;
};
