import isArray from "lodash/isArray.js";
import { App, EnvSchemas, ServerDeploy } from "../../../../types/index.js";
import {
  DockerComposeService,
  DockerComposeServices,
} from "../../../../types/docker.js";
import {
  appHasDockerFile,
  formatEnvPath,
  getDockerFileName,
  globToPaths,
} from "../../index.js";
import { getWorkdirPath, getWorkdirSubPath } from "../getWorkdirPath.js";
import { dockerComposeServiceName } from "./serviceName.js";
import { getAppDomains } from "../../config/domain.js";
import { stripHttpsFromUrl } from "@/index.js";

export const createComposeServices = async (
  apps: App[],
  deploy: ServerDeploy,
  envSchemas: EnvSchemas | undefined
): Promise<DockerComposeServices> => {
  const modulePaths = (
    await globToPaths(["./**/package.json", "!**/node_modules"])
  ).map((p) => p.replace("package.json", "node_modules")); // Vorgehensweise hat den Grund, dass nicht überall die node_modules vorhanden sein müssen zum Zeitpunkt der Erstellung, jedoch die package.json

  const services = apps.reduce(
    (prev, app) => ({
      ...prev,
      [dockerComposeServiceName(app.name)]: createComposeService(
        app,
        deploy,
        envSchemas,
        modulePaths
      ),
    }),
    {}
  );

  return services;
};

const createComposeService = (
  app: App,
  deploy: ServerDeploy,
  envSchemas: EnvSchemas | undefined,
  modulePaths: string[] | undefined = []
) => {
  const image = !appHasDockerFile(app) ? app.docker?.image : undefined;

  const build = appHasDockerFile(app)
    ? { context: ".", dockerfile: getDockerFileName(app.name) }
    : undefined;

  if (!build && !image)
    throw new Error(
      `Please define a build step or a predefined docker-image in the app ${app.name}`
    );

  const volumes = [
    ...(app.build
      ? [
          `./:${getWorkdirPath(app.docker?.workDir)}`,
          ...modulePaths.map((p) => getWorkdirSubPath(app.docker?.workDir, p)),
        ]
      : []),
    ...(app.docker?.volumes?.map((v) => {
      if (!v.includes(":"))
        return `${v}:${getWorkdirSubPath(app.docker?.workDir, v)}`;
      return v;
    }) || []),
  ];

  const envFile =
    app.env &&
    envSchemas &&
    (isArray(app.env)
      ? app.env.map((e) => formatEnvPath(e.path))
      : [formatEnvPath(app.env.path)]);

  const appDomains = getAppDomains(app, deploy);

  const environment = [
    ...(appDomains
      ? [
          `VIRTUAL_HOST=${stripHttpsFromUrl(appDomains.url)}`,
          `VIRTUAL_PORT=${app.docker.port?.join(",")}`,
          `LETSENCRYPT_HOST=${stripHttpsFromUrl(appDomains.url)}${
            appDomains.redirects
              ? `,${appDomains.redirects.map((r) => stripHttpsFromUrl(r)).join(",")}`
              : ""
          }`,
        ]
      : []),
    ...(app.docker?.environment ? app.docker?.environment : []),
  ];

  const service: DockerComposeService = {
    container_name: dockerComposeServiceName(app.name),
    image,
    build,
    restart: "always",
    ports: app.docker?.port
      ? app.docker?.port.map((port) => `${port}:${port}`)
      : undefined,
    volumes: volumes.length !== 0 ? volumes : undefined,
    env_file: envFile,
    environment,
    links: app.docker?.links,
    command: app.docker?.command,
  };

  return service;
};
