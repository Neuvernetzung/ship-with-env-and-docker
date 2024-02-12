import merge from "lodash/merge.js";
import { EnvSchemas, Server } from "../../../../types/index.js";
import set from "lodash/set.js";

import {
  DockerCompose,
  DockerComposeServices,
} from "../../../../types/docker.js";
import { createHelperServices } from "../../index.js";
import { createComposeServices } from "./createServices.js";
import { ServerDeploy } from "../../../../types/deploys.js";
import {
  ACME_COMPANION_VOLUME_NAME,
  NGINX_CERTS_VOLUME_NAME,
  NGINX_CONFIG_VOLUME_NAME,
  NGINX_DHPARAM_VOLUME_NAME,
  NGINX_HTML_VOLUME_NAME,
  NGINX_VHOST_VOLUME_NAME,
} from "@/constants/docker/volumes.js";
import { NGINX_SERVICE_NAME } from "@/constants/index.js";

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
    [NGINX_CONFIG_VOLUME_NAME]: {},
    [NGINX_VHOST_VOLUME_NAME]: {},
    [NGINX_HTML_VOLUME_NAME]: {},
    [NGINX_DHPARAM_VOLUME_NAME]: {},
    [NGINX_CERTS_VOLUME_NAME]: {},
    [ACME_COMPANION_VOLUME_NAME]: {},
    ...(server.sharedDockerVolumes || [])?.reduce((volumes, vol) => {
      set(volumes, vol, {});
      return volumes;
    }, {}),
  };

  const services = await createComposeServices(server.apps, deploy, env);

  return {
    version,
    services: merge(defaultServices, services),
    volumes,
    networks: { [NGINX_SERVICE_NAME]: { external: true } },
  };
};
