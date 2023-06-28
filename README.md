# SWEAD - (Ship-with-Env-and-Docker)

SWEAD is an opinionated framework for deploying Node.js applications on Linux servers.

## Motivation

I created this framework because I was very annoyed with having to adjust my deployment script every time, create Dockerfiles, Docker-compose files etc. and wanted to simplify this process and bundle it into a single config file.

# Usage

Initialize SWEAD Config

```node
npx swead init
```

This will create a swead-config.ts file with a little boilerplate.

## CLI Usage

When the config has been entered, you can start the deployment with `npx swead production`, `npx swead staging` or the local mode with `npx swead local` or `npx swead dev` start.

## Node.js Usage

```node
npm install swead
```

```ts
import {runProduction, runStaging, runLocal, runDev} from "swead"
import type {EnvSchemas, SweadConfig, Args} from "swead"
 
await runProduction(envSchemas: EnvSchemas | undefined, config: SweadConfig, args: Args)

await runStaging(envSchemas: EnvSchemas | undefined, config: SweadConfig, args: Args)

await runLocal(envSchemas: EnvSchemas | undefined, config: SweadConfig, args: Args)

await runDev(envSchemas: EnvSchemas | undefined, config: SweadConfig, args: Args)
```
