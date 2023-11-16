import { Server } from "../../../../types/index";
import { DockerComposeService } from "../../../../types/docker";
import { dockerComposeServiceName } from "../../docker/compose/serviceName";
import { getHelpersPath } from "../getHelpersPath";
import { ServerDeploy } from "../../../../types/deploys";
import {
  CERTBOT_CERTS_VOLUME,
  CERTBOT_VOLUME,
  NGINX_PATH,
  NGINX_SERVICE_NAME,
  NGINX_SSL_VOLUME,
  certbotBasePath,
  certificateBasePath,
  nginxSSLPath,
} from "@/constants";
import { getAppDomain } from "../../config/domain";

export const createNginxServices = (server: Server, deploy: ServerDeploy) => {
  const volumes = [
    "./logs/nginx:/var/log/nginx",
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
