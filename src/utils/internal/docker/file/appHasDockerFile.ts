import { App } from "../../../../types/index";

export const appHasDockerFile = (app: App) => {
  if (app.build) return true;
  return false;
};
