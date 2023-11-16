import { z } from "zod";
import { EnvSchemas } from "./env";
import { Branches, zBranches } from "./helpers";
import {
  DevCommandUnion,
  LocalCommandUnion,
  zDevCommandUnion,
  zLocalCommandUnion,
} from "./local";
import { Server, zServer } from "./server";

export type Servers<T extends EnvSchemas = EnvSchemas> = Record<
  string,
  Server<T>
>;

export type SweadConfig<T extends EnvSchemas = EnvSchemas> = {
  dev?: DevCommandUnion<T>;
  local?: LocalCommandUnion<T>;
  server?: Servers;
  branches?: Branches;
};

export const zSweadConfig: z.ZodType<SweadConfig> = z.object({
  dev: zDevCommandUnion.optional(),
  local: zLocalCommandUnion.optional(),
  server: z.record(zServer).optional(),
  branches: zBranches,
});
