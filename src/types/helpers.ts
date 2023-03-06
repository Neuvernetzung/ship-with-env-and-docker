import { toASCII } from "punycode";
import { z } from "zod";

export type ExposeFolder = z.infer<typeof zExposeFolder>;

export const zExposeFolder = z.object({
  url: z
    .string()
    .url()
    .transform((url) => toASCII(url)), // Umwandeln zu ASCII; notwendig für Let's Encrypt etc.,
  path: z.string().startsWith("/"),
});

export type Certbot = z.infer<typeof zCertbot>;

export const zCertbot = z.object({ email: z.string().email().optional() });

export type Branches = z.infer<typeof zBranches>;

export const zBranches = z.object({
  staging: z.string().optional(),
  production: z.string().optional(),
});
