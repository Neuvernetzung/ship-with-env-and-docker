import {
  NGINX_FULL_CHAIN_FILE_NAME,
  NGINX_PRIVATE_KEY_FILE_NAME,
  getDummyCertificatePath,
} from "@/constants/nginx/index.js";
import { ServerDomainConfig } from "@/index.js";
import { join } from "@/utils/internal/files/join.js";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";

export const createDummyScript = (domains: ServerDomainConfig) => {
  const finalUrl = stripHttpsFromUrl(domains.url);
  const redirects = domains.redirects
    ? domains.redirects.map((redirect) => stripHttpsFromUrl(redirect))
    : undefined;

  const dummyPath = getDummyCertificatePath(finalUrl);

  const fullChainPath = join(dummyPath, NGINX_FULL_CHAIN_FILE_NAME);
  const privKeyPath = join(dummyPath, NGINX_PRIVATE_KEY_FILE_NAME);

  return `
      if [ ! -f "${fullChainPath}" ]; then
          echo "Generating dummy certificate for ${finalUrl}."
          mkdir -p "${dummyPath}"
          printf "[dn]\nCN=${finalUrl}\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:${finalUrl}${
            redirects
              ? `, ${redirects.map((redirect) => `DNS:${redirect}`).join(", ")}`
              : ""
          }\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth" > openssl.cnf
          openssl req -x509 -out "${fullChainPath}" -keyout "${privKeyPath}" \
          -newkey rsa:2048 -nodes -sha256 \
          -subj "/CN=${finalUrl}" -extensions EXT -config openssl.cnf
          rm -f openssl.cnf
          echo "Dummy certificate generation ${finalUrl} successful."
      fi`;
};
