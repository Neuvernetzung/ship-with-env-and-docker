import { App, EnvConfig } from "../../../types/index.js";
import { clean, createEnvFiles, runNodeProcess } from "../index.js";

export const build = async (app: App, env: EnvConfig | undefined) => {
  await createEnvFiles(env, app.env);

  if (!app.build) return;

  await clean(app.build.cleanUp);

  await app.build.beforeFunction?.(app);

  await runNodeProcess(app.build.command);

  await app.build.afterFunction?.(app);
};
