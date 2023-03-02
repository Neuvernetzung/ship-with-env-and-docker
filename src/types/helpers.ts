import { z } from "zod";

export type Certbot = z.infer<typeof zCertbot>;

export const zCertbot = z.object({ email: z.string().email().optional() });

export type Branches = z.infer<typeof zBranches>;

export const zBranches = z.object({
  staging: z.string().optional(),
  production: z.string().optional(),
});
