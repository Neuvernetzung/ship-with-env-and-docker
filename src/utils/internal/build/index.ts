import { ServerDeploy } from "../../../types/deploys.js";
import { App, EnvSchemas } from "../../../types/index.js";
import {
  clean,
  createEnvFiles,
  runNodeOptions,
  runNodeProcess,
} from "../index.js";

export const build = async (
  app: App,
  deploy: ServerDeploy,
  envSchemas: EnvSchemas | undefined,
  options?: runNodeOptions
) => {
  await createEnvFiles(envSchemas, deploy.envs, app.env);

  if (!app.build) return;

  await clean(app.build.cleanUp);

  await app.build.beforeFunction?.(app);

  await runNodeProcess(app.build.command, options);

  await app.build.afterFunction?.(app);
};
