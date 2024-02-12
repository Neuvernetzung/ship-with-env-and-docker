import type { HelperFile } from "../../handleHelperFiles.js";
import { createDockerGenNginxTemplate } from "./template.js";

export const createDockerGenFiles = async (): Promise<HelperFile[]> => {
  const dockerGenNginxTemplate = await createDockerGenNginxTemplate();

  return [dockerGenNginxTemplate];
};
