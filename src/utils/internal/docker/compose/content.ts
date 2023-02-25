import merge from "lodash/merge.js";
import { App, EnvConfig } from "../../../../types/config.js";

import { DockerCompose, DockerFile } from "../../../../types/docker.js";
import { createComposeServices } from "./createServices.js";

export const createComposeContent = async (
  apps: App[],
  env: EnvConfig | undefined
): Promise<DockerCompose> => {
  const version = "3.8";

  const defaultServices = {};

  const volumes = {};

  const services = await createComposeServices(apps, env);

  return { version, services: merge(defaultServices, services), volumes };
};
