import merge from "lodash/merge.js";
import { EnvSchemas, Server } from "../../../../types/index.js";
import set from "lodash/set.js";

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
import { ServerDeploy } from "../../../../types/deploys.js";

export const createComposeContent = async (
  server: Server,
  deploy: ServerDeploy,
  env: EnvSchemas | undefined
): Promise<DockerCompose> => {
  const version = "3.8";

  const defaultServices: DockerComposeServices = createHelperServices(
    server,
    deploy
  );

  const volumes: Record<string, object> = {
    [NGINX_SSL_VOLUME]: {},
    [CERTBOT_CERTS_VOLUME]: {},
    [CERTBOT_VOLUME]: {},
    ...(server.sharedDockerVolumes || [])?.reduce((volumes, vol) => {
      set(volumes, vol, {});
      return volumes;
    }, {}),
  };

  const services = await createComposeServices(server.apps, env);

  return { version, services: merge(services, defaultServices), volumes };
};
