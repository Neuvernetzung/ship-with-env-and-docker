import { DockerComposeService } from "../../../../types/docker";
import { getHelpersPath } from "../getHelpersPath";
import { NGINX_SERVICE_NAME } from "../index";
import { CERTBOT_PATH } from "./createCertbotFiles";

export const CERTBOT_SERVICE_NAME = "certbot";

export const CERTBOT_VOLUME = "certbot";
export const CERTBOT_CERTS_VOLUME = "certbot_certs";

export const createCertbotServices = () => {
  const certbot: DockerComposeService = {
    container_name: CERTBOT_SERVICE_NAME,
    build: getHelpersPath(CERTBOT_PATH),
    volumes: [
      "./logs/letsencrypt:/var/log/letsencrypt",
      `${CERTBOT_CERTS_VOLUME}:/etc/letsencrypt`,
      `${CERTBOT_VOLUME}:/var/www/certbot`,
    ],
    links: [NGINX_SERVICE_NAME],
  };

  return certbot;
};
