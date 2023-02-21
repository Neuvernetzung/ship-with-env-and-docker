import { z } from "zod";

import { EnvConfig, SweadConfig } from "./src/types/config.js";

export const env = {
  admin: {
    path: "./apps/admin",
    schema: z.object({ BASE_URL: z.string().url() }),
  },
  store: {
    path: "./apps/store",
    schema: z.object({
      BASE_URL: z.string().url(),
      ADMIN_URL: z.string().url(),
    }),
  },
  config: {
    path: "./",
    schema: z.object({ TEST: z.string() }),
  },
} satisfies EnvConfig;

export const config: SweadConfig<typeof env> = {
  dev: [
    {
      name: "Admin",
      env: [
        { key: "admin", data: { BASE_URL: "http://localhost:1337" } },
        {
          key: "config",
          data: {
            TEST: "string",
          },
        },
      ],
      open: "http://localhost:1337",
      command: "turbo run dev --scope=admin -- -p 1337",
      cacheToClean: ["./apps/admin/.next"],
    },
    {
      name: "Store",
      env: {
        key: "store",
        data: {
          BASE_URL: "http://localhost:3000",
          ADMIN_URL: "http://localhost:1337",
        },
      },
      command: "turbo run dev --scope=store",
      waitOn: ["http://localhost:1337"],
      cacheToClean: "./apps/store/.next",
    },
  ],

  servers: [],
};
