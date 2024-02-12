import { Server } from "../../../../types/index.js";
import { DockerComposeService } from "../../../../types/docker.js";
import { ServerDeploy } from "../../../../types/deploys.js";

import { DOCKER_SOCK_PATH } from "@/constants/docker/volumes.js";
import {
  WATCHTOWER_IMAGE_NAME,
  WATCHTOWER_SERVICE_NAME,
} from "@/constants/watchtower/docker.js";
import {
  watchtowerConfigName,
  watchtowerHelperFile,
} from "@/constants/watchtower/index.js";

export const createWatchtowerServices = (deploy: ServerDeploy) => {
  const volumes = [
    `${DOCKER_SOCK_PATH}:${DOCKER_SOCK_PATH}:ro`,
    ...(deploy.docker?.registries && deploy.docker.registries.length > 0
      ? [`./${watchtowerHelperFile}:/${watchtowerConfigName}:ro`]
      : []),
  ];

  const watchtower: DockerComposeService = {
    image: WATCHTOWER_IMAGE_NAME,
    container_name: WATCHTOWER_SERVICE_NAME,
    restart: "always",
    volumes,
    command: "--interval 60 --rolling-restart --cleanup",
  };

  return watchtower;
};
