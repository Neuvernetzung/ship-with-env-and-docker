import { z } from "zod";

export type Notification = z.infer<typeof zNotification>;

export const zNotification = z.object({ email: z.string().email().optional() });

export type Branches = z.infer<typeof zBranches>;

export const zBranches = z.object({
  staging: z.string().optional(),
  production: z.string().optional(),
});
