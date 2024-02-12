import { Server } from "../../../types/index.js";
import { DockerComposeServices } from "../../../types/docker.js";
import { createNginxServices } from "./index.js";
import { ServerDeploy } from "../../../types/deploys.js";
import { createDockerGenServices } from "./docker-gen/service.js";
import { createAcmeCompanionServices } from "./acme-companion/service.js";
import { NGINX_SERVICE_NAME } from "@/constants/index.js";
import { DOCKER_GEN_SERVICE_NAME } from "@/constants/docker-gen/docker.js";
import { ACME_COMPANION_SERVICE_NAME } from "@/constants/acme-companion/docker.js";
import { WATCHTOWER_SERVICE_NAME } from "@/constants/watchtower/docker.js";
import { createWatchtowerServices } from "./watchtower/service.js";

export const createHelperServices = (server: Server, deploy: ServerDeploy) => {
  const nginx = createNginxServices(server, deploy);
  const dockerGen = createDockerGenServices();
  const acmeCompanion = createAcmeCompanionServices(deploy);

  const services: DockerComposeServices = {
    [NGINX_SERVICE_NAME]: nginx,
    [DOCKER_GEN_SERVICE_NAME]: dockerGen,
    [ACME_COMPANION_SERVICE_NAME]: acmeCompanion,
  };

  if (!server.docker?.watchtower?.disabled) {
    const watchtower = createWatchtowerServices(deploy);

    services[WATCHTOWER_SERVICE_NAME] = watchtower;
  }

  return services;
};
