import { App } from "../../../../types/config.js";

export const appHasDockerFile = (app: App) => {
  if (app.build) return true;
  return false;
};
