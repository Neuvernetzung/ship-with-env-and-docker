import { DockerComposeService } from "../../../../types/docker.js";
import {
  NGINX_SERVICE_NAME,
  nginxDefaultConfigPath,
} from "@/constants/nginx/index.js";
import { nginxBaseVolumes } from "../index.js";
import {
  DOCKER_GEN_SERVICE_NAME,
  DOCKER_GEN_IMAGE_NAME,
  dockerGenNginxTemplatePath,
} from "@/constants/docker-gen/index.js";
import {
  ACME_COMPANION_VOLUME_NAME,
  DOCKER_SOCK_PATH,
} from "@/constants/docker/volumes.js";
import { acmeCompanionScriptPath } from "@/constants/acme-companion/index.js";
import {
  ACME_COMPANION_IMAGE_NAME,
  ACME_COMPANION_SERVICE_NAME,
} from "@/constants/acme-companion/docker.js";
import type { ServerDeploy } from "@/index.js";

export const createAcmeCompanionServices = (deploy: ServerDeploy) => {
  const volumes = [
    ...nginxBaseVolumes,
    `${ACME_COMPANION_VOLUME_NAME}:${acmeCompanionScriptPath}`,
    `${DOCKER_SOCK_PATH}:${DOCKER_SOCK_PATH}:ro`,
  ];

  const environment = [
    ...(deploy.notifications?.email
      ? [`DEFAULT_EMAIL=${deploy.notifications.email}`]
      : []),
    `NGINX_PROXY_CONTAINER=${NGINX_SERVICE_NAME}`,
    `NGINX_DOCKER_GEN_CONTAINER=${DOCKER_GEN_SERVICE_NAME}`,
  ];

  const acmeCompanion: DockerComposeService = {
    image: ACME_COMPANION_IMAGE_NAME,
    container_name: ACME_COMPANION_SERVICE_NAME,
    restart: "always",
    depends_on: [NGINX_SERVICE_NAME, DOCKER_GEN_SERVICE_NAME],
    volumes,
    environment,
  };

  return acmeCompanion;
};
