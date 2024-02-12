import { Server } from "../../../../types/index.js";
import { DockerComposeService } from "../../../../types/docker.js";
import { dockerComposeServiceName } from "../../docker/compose/serviceName.js";
import { ServerDeploy } from "../../../../types/deploys.js";
import {
  NGINX_IMAGE_NAME,
  NGINX_SERVICE_NAME,
  nginxCertsDir,
  nginxConfigDir,
  nginxDhparamsDir,
  nginxHtmlDir,
  nginxVhostDir,
} from "@/constants/nginx/index.js";
import { getAppDomains } from "../../config/domain.js";
import {
  NGINX_CERTS_VOLUME_NAME,
  NGINX_CONFIG_VOLUME_NAME,
  NGINX_DHPARAM_VOLUME_NAME,
  NGINX_HTML_VOLUME_NAME,
  NGINX_VHOST_VOLUME_NAME,
} from "@/constants/docker/volumes.js";

export const nginxBaseVolumes = [
  `${NGINX_CONFIG_VOLUME_NAME}:${nginxConfigDir}`,
  `${NGINX_VHOST_VOLUME_NAME}:${nginxVhostDir}`,
  `${NGINX_HTML_VOLUME_NAME}:${nginxHtmlDir}`,
  `${NGINX_DHPARAM_VOLUME_NAME}:${nginxDhparamsDir}`,
  `${NGINX_CERTS_VOLUME_NAME}:${nginxCertsDir}`,
];

export const createNginxServices = (server: Server, deploy: ServerDeploy) => {
  const volumes = [...nginxBaseVolumes];

  const nginx: DockerComposeService = {
    image: NGINX_IMAGE_NAME,
    container_name: NGINX_SERVICE_NAME,
    ports: ["80:80", "443:443"],
    restart: "always",
    volumes,
    links: server.apps
      .filter((app) => getAppDomains(app, deploy))
      .map((app) => dockerComposeServiceName(app.name)),
  };

  return nginx;
};
