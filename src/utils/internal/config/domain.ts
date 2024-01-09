import type { App, ServerDeploy, ServerDomainConfig } from "@/types/index.js";

export const getAppDomains = (
  app: App,
  deploy: ServerDeploy
): ServerDomainConfig | undefined => {
  const domains = deploy.use.domains.find((domain) => domain.app === app.name);

  return domains;
};
