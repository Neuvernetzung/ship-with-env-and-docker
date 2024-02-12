import { z } from "zod";
import { EnvSchemas, EnvLocalation, zEnvLocalation } from "./env.js";

type Command = z.infer<typeof zCommand>;

const zCommand = z.object({ command: z.string() });

type LocalStart<T extends EnvSchemas = EnvSchemas> = {
  name: string;
  env?: EnvLocalation<T> | EnvLocalation<T>[];
  waitOn?: string | string[];
  open?: string;
  cleanUp?: string | string[];
};

const zLocalStart = z.object({
  name: z.string(),
  env: z.union([zEnvLocalation, z.array(zEnvLocalation)]).optional(),
  waitOn: z.union([z.string(), z.array(z.string())]).optional(),
  open: z.string().optional(),
  cleanUp: z.union([z.string(), z.array(z.string())]).optional(),
}) satisfies z.ZodType<LocalStart>;

export type DevCommand<T extends EnvSchemas = EnvSchemas> = LocalStart<T> & {
  dev: Command;
};

const zDevCommand: z.ZodType<DevCommand> = zLocalStart.extend({
  dev: zCommand,
});

export type DevCommandUnion<T extends EnvSchemas = EnvSchemas> =
  | DevCommand<T>
  | DevCommand<T>[];

export const zDevCommandUnion: z.ZodType<DevCommandUnion> = z.union([
  zDevCommand,
  z.array(zDevCommand),
]);

export type LocalCommand<T extends EnvSchemas = EnvSchemas> = LocalStart<T> & {
  build?: Command;
  start?: Command;
};

const zLocalCommand: z.ZodType<LocalCommand> = zLocalStart.extend({
  build: zCommand.optional(),
  start: zCommand.optional(),
});

export type LocalCommandUnion<T extends EnvSchemas = EnvSchemas> =
  | LocalCommand<T>
  | LocalCommand<T>[];

export const zLocalCommandUnion: z.ZodType<LocalCommandUnion> = z.union([
  zLocalCommand,
  z.array(zLocalCommand),
]);
