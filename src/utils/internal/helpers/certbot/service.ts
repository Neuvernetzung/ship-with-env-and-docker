import {
  CERTBOT_CERTS_VOLUME,
  CERTBOT_PATH,
  CERTBOT_SERVICE_NAME,
  CERTBOT_VOLUME,
  NGINX_SERVICE_NAME,
  certbotBasePath,
  certificateBasePath,
} from "@/constants/index.js";
import { DockerComposeService } from "../../../../types/docker.js";
import { getHelpersPath } from "../getHelpersPath.js";

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
