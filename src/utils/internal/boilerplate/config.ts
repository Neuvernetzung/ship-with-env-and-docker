export const configBoilerPlate = `import { z } from "zod";
import { EnvConfig, SweadConfig } from "swead";

export const env = {
  example: z.string(),
} satisfies EnvConfig;

export const config: SweadConfig<typeof env> = {
  dev: [],
  local: [],
  branches: {
    staging: "develop",
    production: "master",
  },
  staging: [],
  production: [],
};
`;
