import { CRON_PATH, CRON_SERVICE_NAME } from "@/constants/cron/index.js";
import { DockerComposeService } from "../../../../types/docker.js";
import { getHelpersPath } from "../getHelpersPath.js";
import {
  CERTBOT_CERTS_VOLUME,
  CERTBOT_SERVICE_NAME,
  CERTBOT_VOLUME,
  certbotBasePath,
  certificateBasePath,
} from "@/constants/certbot/index.js";
import { NGINX_SERVICE_NAME } from "@/constants/nginx/docker.js";

export const createCronServices = () => {
  const cron: DockerComposeService = {
    container_name: CRON_SERVICE_NAME,
    build: getHelpersPath(CRON_PATH),
    volumes: [
      "/var/run/docker.sock:/var/run/docker.sock",
      "./:/workdir:ro",
      `${CERTBOT_CERTS_VOLUME}:${certificateBasePath}`,
      `${CERTBOT_VOLUME}:${certbotBasePath}`,
    ],
    links: [CERTBOT_SERVICE_NAME, NGINX_SERVICE_NAME],
    restart: "always",
  };

  return cron;
};
