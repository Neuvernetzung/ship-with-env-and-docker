import { z } from "zod";
import { EnvConfig, EnvEntry, zEnvEntry } from "./env.js";

type Command = z.infer<typeof zCommand>;

const zCommand = z.object({ command: z.string() });

type LocalStart<T extends EnvConfig = EnvConfig> = {
  name: string;
  env?: EnvEntry<T> | EnvEntry<T>[];
  waitOn?: string | string[];
  open?: string;
  cleanUp?: string | string[];
};

const zLocalStart = z.object({
  name: z.string(),
  env: z.union([zEnvEntry, z.array(zEnvEntry)]).optional(),
  waitOn: z.union([z.string(), z.array(z.string())]).optional(),
  open: z.string().optional(),
  cleanUp: z.union([z.string(), z.array(z.string())]).optional(),
}) satisfies z.ZodType<LocalStart>;

export type DevCommand<T extends EnvConfig = EnvConfig> = LocalStart<T> & {
  dev: Command;
};

const zDevCommand: z.ZodType<DevCommand> = zLocalStart.extend({
  dev: zCommand,
});

export type DevCommandUnion<T extends EnvConfig = EnvConfig> =
  | DevCommand<T>
  | DevCommand<T>[];

export const zDevCommandUnion: z.ZodType<DevCommandUnion> = z.union([
  zDevCommand,
  z.array(zDevCommand),
]);

export type LocalCommand<T extends EnvConfig = EnvConfig> = LocalStart<T> & {
  build?: Command;
  start?: Command;
};

const zLocalCommand: z.ZodType<LocalCommand> = zLocalStart.extend({
  build: zCommand.optional(),
  start: zCommand.optional(),
});

export type LocalCommandUnion<T extends EnvConfig = EnvConfig> =
  | LocalCommand<T>
  | LocalCommand<T>[];

export const zLocalCommandUnion: z.ZodType<LocalCommandUnion> = z.union([
  zLocalCommand,
  z.array(zLocalCommand),
]);
