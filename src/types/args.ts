import { z } from "zod";

export const helperMethods = ["init", "encrypt", "decrypt"] as const;

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
  skip: z
    .string()
    .regex(/^\d+$/, { message: "The skip argument is not an integer." })
    .transform(Number)
    .optional(),
  attached: z.boolean().optional(),
  remove: z.boolean().optional(),
  password: z.string().optional(),
  verbose: z.boolean().optional(),
});
