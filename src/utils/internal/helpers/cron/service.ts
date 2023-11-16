import { CRON_PATH, CRON_SERVICE_NAME } from "@/constants/cron";
import { DockerComposeService } from "../../../../types/docker";
import { getHelpersPath } from "../getHelpersPath";
import {
  CERTBOT_CERTS_VOLUME,
  CERTBOT_SERVICE_NAME,
  CERTBOT_VOLUME,
  NGINX_SERVICE_NAME,
  certbotBasePath,
  certificateBasePath,
} from "@/constants";

export const createCronServices = () => {
  const cron: DockerComposeService = {
    container_name: CRON_SERVICE_NAME,
    build: getHelpersPath(CRON_PATH),
    volumes: [
      "./logs/cron:/var/log/cron",
      "./logs/letsencrypt:/var/log/letsencrypt",
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
