import { z } from "zod";
import { EnvConfig, zEnvConfig } from "./env.js";
import { Branches, zBranches } from "./helpers.js";
import {
  DevCommandUnion,
  LocalCommandUnion,
  zDevCommandUnion,
  zLocalCommandUnion,
} from "./local.js";
import { DeployUnion, zDeployUnion } from "./server.js";

export type SweadConfig<T extends EnvConfig = EnvConfig> = {
  dev?: DevCommandUnion<T>;
  local?: LocalCommandUnion<T>;
  staging?: DeployUnion<T>;
  production?: DeployUnion<T>;
  branches?: Branches;
  encrypted?: string;
};

export const zSweadConfig: z.ZodType<SweadConfig> = z.object({
  dev: zDevCommandUnion.optional(),
  local: zLocalCommandUnion.optional(),
  staging: zDeployUnion.optional(),
  production: zDeployUnion.optional(),
  branches: zBranches,
  encrypted: z.string().optional(),
});

export type SweadConfigFile = {
  config: SweadConfig;
  env?: EnvConfig;
};

export const zSweadConfigFile: z.ZodType<SweadConfigFile> = z.object({
  config: zSweadConfig,
  env: zEnvConfig.optional(),
});
