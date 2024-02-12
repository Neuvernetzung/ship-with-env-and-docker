import { DockerComposeService } from "../../../../types/docker.js";
import {
  NGINX_SERVICE_NAME,
  nginxDefaultConfigPath,
} from "@/constants/nginx/index.js";
import { nginxBaseVolumes } from "../index.js";
import {
  DOCKER_GEN_SERVICE_NAME,
  DOCKER_GEN_HELPER_TEMPLATE_PATH,
  DOCKER_GEN_IMAGE_NAME,
  dockerGenNginxTemplatePath,
} from "@/constants/docker-gen/index.js";
import {
  DOCKER_SOCK_PATH,
  DOCKER_SOCK_TMP_PATH,
} from "@/constants/docker/volumes.js";

export const createDockerGenServices = () => {
  const volumes = [
    ...nginxBaseVolumes,
    `./${DOCKER_GEN_HELPER_TEMPLATE_PATH}:${dockerGenNginxTemplatePath}:ro`,
    `${DOCKER_SOCK_PATH}:${DOCKER_SOCK_TMP_PATH}:ro`,
  ];

  const dockerGen: DockerComposeService = {
    image: DOCKER_GEN_IMAGE_NAME,
    container_name: DOCKER_GEN_SERVICE_NAME,
    command: `-notify-sighup ${NGINX_SERVICE_NAME} -watch ${dockerGenNginxTemplatePath} ${nginxDefaultConfigPath}`,
    restart: "always",
    depends_on: [NGINX_SERVICE_NAME],
    volumes,
  };

  return dockerGen;
};
