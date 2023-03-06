#!/usr/bin/env node

import minimist from "minimist";
import { runDev, runLocal, runProduction, runStaging } from "../index.js";
import { errorHandler, getConfig } from "../utils/internal/index.js";

const cliOpts: minimist.Opts = {
  string: ["_", "c"],
  alias: {
    c: "config",
  },
};

const runMethods = ["production", "staging", "local", "dev"];

const totalMethods = [...runMethods];

const main = async () => {
  const args = minimist(process.argv.slice(2), cliOpts);

  const method = args._[0];

  if (!method)
    throw new Error(`Please define a method. (${totalMethods.join(", ")})`);

  if (!totalMethods.includes(method)) {
    throw new Error(
      `This method is not included in (${totalMethods.join(", ")})`
    );
  }

  if (runMethods.includes(method)) {
    const { env, config } = await getConfig(args.config);

    if (method === "production") {
      runProduction(env, config);
      return;
    }
    if (method === "staging") {
      runStaging(env, config);
      return;
    }
    if (method === "local") {
      runLocal(env, config);
      return;
    }
    if (method === "dev") {
      runDev(env, config);
      return;
    }
  }
};

main().catch(errorHandler);
