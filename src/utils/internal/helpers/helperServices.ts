import { Server } from "../../../types/index.js";
import { DockerComposeServices } from "../../../types/docker.js";
import {
  createCertbotServices,
  createNginxServices,
  createCronServices,
} from "./index.js";

export const createHelperServices = (deploy: Server) => {
  const certbot = createCertbotServices();
  const cron = createCronServices();
  const nginx = createNginxServices(deploy);

  const services: DockerComposeServices = {
    certbot,
    cron,
    nginx,
  };

  return services;
};
