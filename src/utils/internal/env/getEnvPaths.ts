import isArray from "lodash/isArray";
import { App, EnvSchemas } from "../../../types/index";
import { performSingleOrMultiple } from "../performSingleOrMultiple";
import { formatEnvPath } from "./formatEnvPath";

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
