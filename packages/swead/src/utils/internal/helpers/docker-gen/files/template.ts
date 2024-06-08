import type { HelperFile } from "../../handleHelperFiles.js";
import {
  DOCKER_GEN_HELPER_TEMPLATE_PATH,
  DOCKER_GEN_NGINX_TEMPLATE_NAME,
} from "@/constants/docker-gen/index.js";
import { join, logger } from "@/utils/internal/index.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const NGINX_PROXY_TEMPLATE_VERSION = "1.6.0";

const templatePath = `https://raw.githubusercontent.com/nginx-proxy/nginx-proxy/${NGINX_PROXY_TEMPLATE_VERSION}/nginx.tmpl`;

export const createDockerGenNginxTemplate = async (): Promise<HelperFile> => {
  const res = await fetch(templatePath);

  const text = await res.text();

  if (!text)
    // Wenn nicht erreichbar, dann backup nutzen
    logger.warn(
      `Docker-gen template not available, backup is used. Check: ${templatePath}`
    );

  const template =
    text ||
    readFileSync(
      join(
        fileURLToPath(import.meta.resolve("../templates")),
        DOCKER_GEN_NGINX_TEMPLATE_NAME
      ),
      {
        encoding: "utf8",
      }
    );

  return {
    path: DOCKER_GEN_HELPER_TEMPLATE_PATH,
    content: template,
  };
};
