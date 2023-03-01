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
  mongo: {
    path: "./",
    schema: z.object({
      MONGO_INITDB_ROOT_USERNAME: z.string(),
      MONGO_INITDB_ROOT_PASSWORD: z.string(),
    }),
  },
} satisfies EnvConfig;

export const config: SweadConfig<typeof env> = {
  dev: [
    {
      name: "Admin",
      env: [{ key: "admin", data: { BASE_URL: "http://localhost:1337" } }],
      open: "http://localhost:1337",
      command: "turbo run dev --scope=admin -- -p 1337",
      cleanUp: ["./apps/admin/.next"],
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
      cleanUp: "./apps/store/.next",
    },
  ],
  local: [
    {
      name: "Admin",
      env: [{ key: "admin", data: { BASE_URL: "http://localhost:1337" } }],
      open: "http://localhost:1337",
      build: { command: "turbo run build --scope=admin" },
      start: { command: "turbo run start --scope=admin -- -p 1337" },
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
      build: { command: "turbo run build --scope=store" },
      start: { command: "turbo run start --scope=store -- -p 3000" },
      waitOn: ["http://localhost:1337"],
      cleanUp: "./apps/store/.next",
    },
  ],
  branches: {
    staging: "develop",
    production: "develop",
  },
  staging: {
    deploy: [
      {
        server: {
          ip: "82.165.49.217",
          ssh: { user: "root", password: "G!&z*Bpz35" },
          path: "/var/www/html/current",
          neverClean: ["mongo", "upload"],
        },
        apps: [
          {
            name: "Admin",
            url: "https://test-backend.räucherkerzen-shop.de",
            env: [
              { key: "admin", data: { BASE_URL: "http://localhost:1337" } },
            ],
            build: {
              beforeFunction: (app) => console.log("before", app.name),
              command: "turbo run build --scope=admin",
              afterFunction: (app) => console.log("after", app.name),
            },
            start: {
              command: "npx turbo run start --scope=admin -- -p 1337",
            },
            docker: {
              port: 1337,
              volumes: ["/upload", "./logs/npm:/root/.npm/_logs"],
              links: ["mongo"],
              workDir: "/admin",
            },
          },
          {
            name: "Store",
            url: "https://test-store.räucherkerzen-shop.de",
            env: [
              {
                key: "store",
                data: {
                  BASE_URL: "http://localhost:3000",
                  ADMIN_URL: "http://localhost:1337",
                },
              },
            ],
            build: {
              command: "turbo run build --scope=store",
            },
            start: {
              command: "npx turbo run start --scope=store",
            },
            docker: {
              port: 3000,
              volumes: ["./logs/npm:/root/.npm/_logs"],
              workDir: "/store",
            },
          },
          {
            name: "mongo",
            docker: {
              image: "mongo",
              port: 27017,
              volumes: ["./mongo/db:/data/db"],
            },
            env: {
              key: "mongo",
              data: {
                MONGO_INITDB_ROOT_USERNAME: "admin",
                MONGO_INITDB_ROOT_PASSWORD: "root",
              },
            },
          },
        ],
        beforeStart: "echo before",
        afterStart: ["echo after"],
        artifact: {
          paths: ["apps/admin/.next", "apps/store/.next"],
        },
        certbot: {
          email: "t.heerwagen@web.de",
        },
      },
    ],
  },
  production: [
    {
      deploy: [
        {
          server: {
            ip: "82.165.49.217",
            ssh: { user: "root", password: "G!&z*Bpz35" },
            path: "/var/www/html/current",
            neverClean: ["mongo", "upload"],
          },
          apps: [
            {
              name: "Admin",
              url: "https://test-backend.räucherkerzen-shop.de",
              env: [
                { key: "admin", data: { BASE_URL: "http://localhost:1337" } },
              ],
              build: {
                command: "turbo run build --scope=admin",
              },
              start: {
                command: "npx turbo run start --scope=admin -- -p 1337",
              },
              docker: {
                port: 1337,
                volumes: ["/upload"],
                workDir: "/admin",
              },
            },
          ],
          artifact: {
            paths: ["apps/admin/.next"],
          },
        },
      ],
    },
    {
      deploy: [
        {
          server: {
            ip: "212.227.6.113",
            ssh: { user: "root", password: "c%$Ottp4DG" },
            path: "/var/www/html/current",
          },
          apps: [
            {
              name: "Store",
              url: "https://test-frontend.räucherkerzen-shop.de",
              env: [
                {
                  key: "store",
                  data: {
                    BASE_URL: "https://test-frontend.räucherkerzen-shop.de",
                    ADMIN_URL: "https://test-backend.räucherkerzen-shop.de",
                  },
                },
              ],
              build: {
                command: "turbo run build --scope=store",
              },
              start: {
                command: "npx turbo run start --scope=store",
              },
              docker: {
                port: 3000,
                volumes: ["/upload"],
                workDir: "/store",
              },
            },
          ],
          artifact: {
            paths: ["apps/store/.next"],
          },
        },
      ],
    },
  ],
};
