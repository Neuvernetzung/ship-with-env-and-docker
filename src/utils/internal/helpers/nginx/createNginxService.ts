import { Server } from "../../../../types/index.js";
import { DockerComposeService } from "../../../../types/docker.js";
import { dockerComposeServiceName } from "../../docker/compose/serviceName.js";
import { getHelpersPath } from "../getHelpersPath.js";
import { CERTBOT_CERTS_VOLUME, CERTBOT_VOLUME, NGINX_PATH } from "../index.js";

export const NGINX_SERVICE_NAME = "nginx";

export const NGINX_SSL_VOLUME = "nginx_ssl";

export const createNginxServices = (deploy: Server) => {
  const volumes = [
    "./logs/nginx:/var/log/nginx",
    `${NGINX_SSL_VOLUME}:/etc/nginx/ssl`,
    `${CERTBOT_CERTS_VOLUME}:/etc/letsencrypt`,
    `${CERTBOT_VOLUME}:/var/www/certbot`,
  ];

  if (deploy.exposeFolder) {
    volumes.push(`.${deploy.exposeFolder.path}:${deploy.exposeFolder.path}`);
  }

  const cron: DockerComposeService = {
    container_name: NGINX_SERVICE_NAME,
    build: getHelpersPath(NGINX_PATH),
    ports: ["80:80", "443:443"],
    volumes,
    restart: "always",
    links: deploy.apps
      .filter((app) => app.url)
      .map((app) => dockerComposeServiceName(app.name)),
  };

  return cron;
};
