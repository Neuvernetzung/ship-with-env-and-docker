import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl";
import { join } from "@/utils/internal/files/join";
import { nginxSSLPath } from ".";

export const dummyCertificateBasePath = join(nginxSSLPath, "dummy");

export const getDummyCertificatePath = (url: string) =>
  join(dummyCertificateBasePath, stripHttpsFromUrl(url));

export const NGINX_FULL_CHAIN_FILE_NAME = "fullchain.pem";

export const NGINX_PRIVATE_KEY_FILE_NAME = "privkey.pem";
