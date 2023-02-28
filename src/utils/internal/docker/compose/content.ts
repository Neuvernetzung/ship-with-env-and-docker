import merge from "lodash/merge.js";
import { App, EnvConfig } from "../../../../types/config.js";

import {
  DockerCompose,
  DockerComposeServices,
} from "../../../../types/docker.js";
import {
  CERTBOT_CERTS_VOLUME,
  CERTBOT_VOLUME,
  createHelperServices,
  NGINX_SSL_VOLUME,
} from "../../index.js";
import { createComposeServices } from "./createServices.js";

export const createComposeContent = async (
  apps: App[],
  env: EnvConfig | undefined
): Promise<DockerCompose> => {
  const version = "3.8";

  const defaultServices: DockerComposeServices = createHelperServices(apps);

  const volumes = {
    [NGINX_SSL_VOLUME]: {},
    [CERTBOT_CERTS_VOLUME]: {},
    [CERTBOT_VOLUME]: {},
  };

  const services = await createComposeServices(apps, env);

  return { version, services: merge(services, defaultServices), volumes };
};
