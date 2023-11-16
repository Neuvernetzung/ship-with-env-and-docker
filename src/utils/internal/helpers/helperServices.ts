import { Server } from "../../../types/index.js";
import { DockerComposeServices } from "../../../types/docker.js";
import {
  createCertbotServices,
  createNginxServices,
  createCronServices,
} from "./index.js";
import { ServerDeploy } from "../../../types/deploys.js";

export const createHelperServices = (server: Server, deploy: ServerDeploy) => {
  const certbot = createCertbotServices();
  const cron = createCronServices();
  const nginx = createNginxServices(server, deploy);

  const services: DockerComposeServices = {
    certbot,
    cron,
    nginx,
  };

  return services;
};
