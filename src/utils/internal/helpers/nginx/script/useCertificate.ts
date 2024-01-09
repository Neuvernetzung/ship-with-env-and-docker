import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";
import {
  nginxConfigDefaultPath,
  useCertificatesFunctionName,
} from "@/constants/nginx/index.js";
import { getDummyCertificatePath } from "@/constants/nginx/index.js";
import { getCertificateLivePath } from "@/constants/certbot/certificate.js";
import { ServerDomainConfig } from "@/index.js";

export const createUseCertificates = (
  domains: ServerDomainConfig,
  name: string
) => {
  return useCertificateFunction(domains.url, name);
};

const useCertificateFunction = (url: string, name: string) => {
  const finalUrl = stripHttpsFromUrl(url);
  const dummyPath = getDummyCertificatePath(url);
  const certificatePath = getCertificateLivePath(url);

  return `
${useCertificatesFunctionName(name)}() {
    echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für ${finalUrl} eingeleitet." 
    sed -i "s|${dummyPath}|${certificatePath}|g" ${nginxConfigDefaultPath}
    echo "Wechsel von Nginx zu Let's Encrypt Zertifikat für ${finalUrl} erfolgreich."
    }
`;
};
