import { DockerComposeService } from "../../../../types/docker.js";
import { getHelpersPath } from "../getHelpersPath.js";
import { CERTBOT_SERVICE_NAME, NGINX_SERVICE_NAME } from "../index.js";
import { CRON_PATH } from "./createCronFiles.js";

export const CRON_SERVICE_NAME = "cron";

export const createCronServices = () => {
  const cron: DockerComposeService = {
    container_name: CRON_SERVICE_NAME,
    build: getHelpersPath(CRON_PATH),
    volumes: [
      "./logs/cron:/var/log/cron",
      "./logs/letsencrypt:/var/log/letsencrypt",
      "/var/run/docker.sock:/var/run/docker.sock",
      "./:/workdir:ro",
      "certbot_certs:/etc/letsencrypt",
      "certbot:/var/www/certbot",
    ],
    links: [CERTBOT_SERVICE_NAME, NGINX_SERVICE_NAME],
    restart: "always",
  };

  return cron;
};
