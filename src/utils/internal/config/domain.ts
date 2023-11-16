import type { App, ServerDeploy } from "@/types";

export const getAppDomain = (app: App, deploy: ServerDeploy) => {
  const domain = deploy.use.domains.find((domain) => domain.app === app.name)
    ?.url;

  return domain;
};
