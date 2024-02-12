import isArray from "lodash/isArray.js";
import { App, EnvSchemas } from "../../../types/index.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { formatEnvPath } from "./formatEnvPath.js";

export const getEnvPaths = async (
  apps: App | App[],
  env: EnvSchemas | undefined
): Promise<string[]> =>
  (
    await performSingleOrMultiple(apps, async (app) => {
      if (app.env && env) {
        if (isArray(app.env)) return app.env.map((e) => formatEnvPath(e.path));
        return [formatEnvPath(app.env.path)];
      }
      return [];
    })
  ).flat();
