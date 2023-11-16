import type { Certbot, Url } from "@/types/index.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";
import { getCertificateLivePath } from "@/constants/certbot/certificate.js";
import { certbotBasePath } from "@/constants/index.js";

export const createCertbotScriptCommand = (url: Url, certbot?: Certbot) => {
  const finalUrl = stripHttpsFromUrl(url);

  const certificatePath = getCertificateLivePath(finalUrl);

  return `if [ -d "${certificatePath}" ]; then
  echo "Let's Encrypt Certificate for ${finalUrl} already exists."
  else
  echo "Obtaining the certificates for ${finalUrl}"
  
  certbot certonly \
    --webroot \
    -w "${certbotBasePath}" \
    --expand \
    -d "${finalUrl}" \
    ${
      certbot?.email
        ? `--email ${certbot.email}`
        : "--register-unsafely-without-email"
    } \
    --rsa-key-size "4096" \
    --agree-tos \
    --noninteractive || true
  fi`;
};
