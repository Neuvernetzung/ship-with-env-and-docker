import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl";
import { join } from "@/utils/internal/files/join";

export const certificateBasePath = "/etc/letsencrypt";

export const certificateLivePath = join(certificateBasePath, "live");

export const getCertificateLivePath = (url: string) =>
  join(certificateLivePath, stripHttpsFromUrl(url));
