import { z } from "zod";

export const helperMethods = ["init"] as const;

export const runMethods = ["production", "staging", "local", "dev"] as const;

export const totalMethods = [...helperMethods, ...runMethods] as const;

export const zArgs = z.object({
  _: z.array(z.enum(totalMethods)).transform((arr) => arr[0]),
  config: z
    .string()
    .transform((str) => {
      if (str?.includes(".ts") || str?.includes(".js")) return str;
      return `${str}.ts`;
    })
    .optional(),
});
