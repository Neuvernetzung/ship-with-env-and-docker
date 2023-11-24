import { Server } from "../../../../types/index.js";
import { DockerComposeService } from "../../../../types/docker.js";
import { dockerComposeServiceName } from "../../docker/compose/serviceName.js";
import { getHelpersPath } from "../getHelpersPath.js";
import { ServerDeploy } from "../../../../types/deploys.js";
import {
  NGINX_PATH,
  NGINX_SERVICE_NAME,
  NGINX_SSL_VOLUME,
  nginxSSLPath,
} from "@/constants/nginx/index.js";
import { getAppDomain } from "../../config/domain.js";
import {
  CERTBOT_CERTS_VOLUME,
  CERTBOT_VOLUME,
} from "@/constants/certbot/docker.js";
import { certificateBasePath } from "@/constants/certbot/certificate.js";
import { certbotBasePath } from "@/constants/certbot/index.js";

export const createNginxServices = (server: Server, deploy: ServerDeploy) => {
  const volumes = [
    `${NGINX_SSL_VOLUME}:${nginxSSLPath}`,
    `${CERTBOT_CERTS_VOLUME}:${certificateBasePath}`,
    `${CERTBOT_VOLUME}:${certbotBasePath}`,
  ];

  const cron: DockerComposeService = {
    container_name: NGINX_SERVICE_NAME,
    build: getHelpersPath(NGINX_PATH),
    ports: ["80:80", "443:443"],
    volumes,
    restart: "always",
    links: server.apps
      .filter((app) => getAppDomain(app, deploy))
      .map((app) => dockerComposeServiceName(app.name)),
  };

  return cron;
};
