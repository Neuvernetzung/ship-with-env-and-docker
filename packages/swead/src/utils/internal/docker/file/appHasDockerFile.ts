import { App } from "../../../../types/index.js";

export const appHasDockerFile = (app: App) => {
  if (app.build) return true;
  return false;
};
