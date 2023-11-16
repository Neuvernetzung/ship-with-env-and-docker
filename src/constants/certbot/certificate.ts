import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl.js";
import { join } from "@/utils/internal/files/join.js";

export const certificateBasePath = "/etc/letsencrypt";

export const certificateLivePath = join(certificateBasePath, "live");

export const getCertificateLivePath = (url: string) =>
  join(certificateLivePath, stripHttpsFromUrl(url));
