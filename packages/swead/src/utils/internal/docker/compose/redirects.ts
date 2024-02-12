import { ServerDeploy, ServerDomainConfig } from "../../../../types/index.js";
import {
  DockerComposeService,
  DockerComposeServices,
} from "../../../../types/docker.js";

import { dockerComposeRedirectServiceName } from "./serviceName.js";
import { NGINX_SERVICE_NAME } from "@/constants/index.js";
import { stripHttpsFromUrl } from "@/index.js";

export const createRedirectServices = async (
  deploy: ServerDeploy
): Promise<DockerComposeServices> => {
  const services = deploy.use.domains
    .filter(
      (domainConfig) =>
        domainConfig.redirects && domainConfig.redirects.length > 0
    )
    .reduce(
      (prev, domain) => ({
        ...prev,
        [dockerComposeRedirectServiceName(domain.app)]:
          createRedirectService(domain),
      }),
      {}
    );

  return services;
};

const createRedirectService = (domainConfig: ServerDomainConfig) => {
  const service: DockerComposeService = {
    container_name: dockerComposeRedirectServiceName(domainConfig.app),
    restart: "always",
    depends_on: [NGINX_SERVICE_NAME],
    image: "cusspvz/redirect",
    environment: [
      `VIRTUAL_HOST=${domainConfig.redirects?.map((redirect) => stripHttpsFromUrl(redirect))}`,
      `LETSENCRYPT_HOST=${domainConfig.redirects?.map((redirect) => stripHttpsFromUrl(redirect))}`,
      "HTTPS_METHOD=noredirect",
      `REDIRECT=${domainConfig.url}`,
    ],
  };

  return service;
};
