import type { DockerComposeService } from "../../../../types/docker.js";
import type { ServerDeploy } from "../../../../types/deploys.js";

import { DOCKER_SOCK_PATH } from "@/constants/docker/volumes.js";
import {
  WATCHTOWER_IMAGE_NAME,
  WATCHTOWER_SERVICE_NAME,
} from "@/constants/watchtower/docker.js";
import {
  watchtowerConfigName,
  watchtowerHelperFile,
} from "@/constants/watchtower/index.js";
import type { Server } from "@/types/server.js";

export const createWatchtowerServices = (
  server: Server,
  deploy: ServerDeploy
) => {
  const volumes = [
    `${DOCKER_SOCK_PATH}:${DOCKER_SOCK_PATH}:ro`,
    ...(deploy.docker?.registries && deploy.docker.registries.length > 0
      ? [`./${watchtowerHelperFile}:/${watchtowerConfigName}:ro`]
      : []),
  ];

  const intervalSeconds =
    (server.docker?.watchtower?.intervalMinutes || 1) * 60;

  const watchtower: DockerComposeService = {
    image: WATCHTOWER_IMAGE_NAME,
    container_name: WATCHTOWER_SERVICE_NAME,
    restart: "always",
    volumes,
    command: `--interval ${intervalSeconds} --rolling-restart --cleanup`,
  };

  return watchtower;
};
