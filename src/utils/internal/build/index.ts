import { App, EnvConfig } from "../../../types/config.js";
import { clean, createEnvFiles, removeEnv, runNodeProcess } from "../index.js";

export const build = async (app: App, env: EnvConfig | undefined) => {
  if (!app.build) return;

  await clean(app.build.cleanUp);

  await createEnvFiles(env, app.env);

  await app.build.beforeFunction?.(app);

  await runNodeProcess(app.build.command);

  await app.build.afterFunction?.(app);

  await removeEnv(env, app.env);
};
