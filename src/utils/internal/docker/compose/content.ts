import merge from "lodash/merge";
import { EnvSchemas, Server } from "../../../../types/index";
import set from "lodash/set";

import { DockerCompose, DockerComposeServices } from "../../../../types/docker";
import {
  CERTBOT_CERTS_VOLUME,
  CERTBOT_VOLUME,
  createHelperServices,
  NGINX_SSL_VOLUME,
} from "../../index";
import { createComposeServices } from "./createServices";
import { ServerDeploy } from "../../../../types/deploys";

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
