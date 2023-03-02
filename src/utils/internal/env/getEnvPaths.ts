import isArray from "lodash/isArray.js";
import { App, EnvConfig } from "../../../types/index.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { formatEnvPath } from "./formatEnvPath.js";

export const getEnvPaths = async (
  apps: App | App[],
  env: EnvConfig | undefined
): Promise<string[]> =>
  (
    await performSingleOrMultiple(apps, async (app) => {
      if (app.env && env) {
        if (isArray(app.env))
          return app.env.map((e) => formatEnvPath(env[e.key].path));
        return [formatEnvPath(env[app.env.key].path)];
      }
      return;
    })
  ).flat();
