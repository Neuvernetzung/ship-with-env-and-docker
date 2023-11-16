import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl";
import {
  nginxConfigDefaultPath,
  useCertificatesFunctionName,
} from "@/constants/nginx";
import { getDummyCertificatePath } from "@/constants/nginx/dummyCertificate";
import { getCertificateLivePath } from "@/constants/certbot/certificate";

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
