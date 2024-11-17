import { z } from "zod";

export const zEmailNotificationSmtp = z.object({
  user: z.string(),
  pass: z.string(),
  host: z.string().url(),
  port: z.number(),
  fromAdress: z.string().email(),
  toAdresses: z.array(z.string().email()),
});

export type Notification = z.infer<typeof zNotification>;

export const zNotification = z.object({
  email: z.string().email().optional(),
  smtp: zEmailNotificationSmtp.optional(),
});

export type Branches = z.infer<typeof zBranches>;

export const zBranches = z.object({
  staging: z.string().optional(),
  production: z.string().optional(),
});
