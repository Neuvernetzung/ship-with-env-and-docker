import { join } from "@/utils/internal/files/join.js";
import { getHelpersPath } from "../helper/index.js";

export * from "./docker.js";

export const DOCKER_GEN_HELPER_NAME = "docker-gen";

export const DOCKER_GEN_HELPER_DIR = getHelpersPath(DOCKER_GEN_HELPER_NAME);

export const DOCKER_GEN_NGINX_TEMPLATE_NAME = "nginx.tmpl";

export const DOCKER_GEN_HELPER_TEMPLATE_PATH = join(
  DOCKER_GEN_HELPER_DIR,
  DOCKER_GEN_NGINX_TEMPLATE_NAME
);

export const dockerGenBasePath = "/etc/docker-gen";

export const dockerGenTemplatesPath = join(dockerGenBasePath, "templates");

export const dockerGenNginxTemplatePath = join(
  dockerGenTemplatesPath,
  DOCKER_GEN_NGINX_TEMPLATE_NAME
);
