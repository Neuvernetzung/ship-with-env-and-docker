import { Server } from "../../../types/index";
import { DockerComposeServices } from "../../../types/docker";
import {
  createCertbotServices,
  createNginxServices,
  createCronServices,
} from "./index";
import { ServerDeploy } from "../../../types/deploys";

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
