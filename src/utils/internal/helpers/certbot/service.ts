import {
  CERTBOT_CERTS_VOLUME,
  CERTBOT_PATH,
  CERTBOT_SERVICE_NAME,
  CERTBOT_VOLUME,
  NGINX_SERVICE_NAME,
  certbotBasePath,
  certificateBasePath,
} from "@/constants";
import { DockerComposeService } from "../../../../types/docker";
import { getHelpersPath } from "../getHelpersPath";

export const createCertbotServices = () => {
  const certbot: DockerComposeService = {
    container_name: CERTBOT_SERVICE_NAME,
    build: getHelpersPath(CERTBOT_PATH),
    volumes: [
      `${CERTBOT_CERTS_VOLUME}:${certificateBasePath}`,
      `${CERTBOT_VOLUME}:${certbotBasePath}`,
    ],
    links: [NGINX_SERVICE_NAME],
  };

  return certbot;
};
