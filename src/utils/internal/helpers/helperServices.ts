import { App } from "../../../types/index.js";
import { DockerComposeServices } from "../../../types/docker.js";
import {
  createCertbotServices,
  createNginxServices,
  createCronServices,
} from "./index.js";

export const createHelperServices = (apps: App[]) => {
  const certbot = createCertbotServices();
  const cron = createCronServices();
  const nginx = createNginxServices(apps);

  const services: DockerComposeServices = {
    certbot,
    cron,
    nginx,
  };

  return services;
};
