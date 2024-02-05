import type { HelperFile } from "../../handleHelperFiles.js";
import {
  DOCKER_GEN_HELPER_TEMPLATE_PATH,
  DOCKER_GEN_NGINX_TEMPLATE_NAME,
  dockerGenNginxTemplatePath,
} from "@/constants/docker-gen/index.js";
import { join, logger } from "@/utils/internal/index.js";
import { readFileSync } from "fs";

const templatePath =
  "https://raw.githubusercontent.com/nginx-proxy/nginx-proxy/main/nginx.tmpl";

export const createDockerGenNginxTemplate = async (): Promise<HelperFile> => {
  const res = await fetch(templatePath);

  const text = await res.text();

  if (!text)
    // Wenn nicht erreichbar, dann backup nutzen
    logger.warn(
      `Docker-gen template not available, backup is used. Check: ${templatePath}`
    );

  const backupTemplate =
    text ||
    readFileSync(join(__filename, DOCKER_GEN_NGINX_TEMPLATE_NAME), {
      encoding: "utf8",
    });

  return {
    path: DOCKER_GEN_HELPER_TEMPLATE_PATH,
    content: backupTemplate,
  };
};
