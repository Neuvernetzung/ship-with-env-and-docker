#!/usr/bin/env node

import minimist from "minimist";
import {
  runDev,
  runEncrypt,
  runLocal,
  runProduction,
  runStaging,
} from "../index.js";
import { runDecrypt } from "../main/decrypt.js";
import { runInit } from "../main/init.js";
import { runMethods, totalMethods } from "../types/args.js";
import { errorHandler, getConfig, parseArgs } from "../utils/internal/index.js";

const cliOpts: minimist.Opts = {
  string: ["_", "c", "s", "p", "specific"],
  boolean: ["h", "a", "r", "v"],
  alias: {
    c: "config",
    h: "help",
    s: "skip",
    a: "attached",
    r: "remove",
    p: "password",
    v: "verbose",
  },
};

const main = async () => {
  const args = parseArgs(cliOpts);

  const method = args._;

  if (!method)
    throw new Error(`Please define a method. (${totalMethods.join(", ")})`);

  if (!totalMethods.includes(method)) {
    throw new Error(
      `This method is not included in (${totalMethods.join(", ")})`
    );
  }

  if (method === "init") {
    await runInit(args);
    return;
  }
  if (method === "encrypt") {
    await runEncrypt(args);
    return;
  }
  if (method === "decrypt") {
    await runDecrypt(args);
    return;
  }

  if (runMethods.includes(method)) {
    const { envSchemas, config } = await getConfig({
      config: args.config,
      password: args.password,
    });

    if (method === "production") {
      await runProduction(envSchemas, config, args);
      return;
    }

    if (method === "staging") {
      await runStaging(envSchemas, config, args);
      return;
    }

    if (method === "local") {
      await runLocal(envSchemas, config, args);
      return;
    }

    if (method === "dev") {
      await runDev(envSchemas, config, args);
      return;
    }
  }
};

main().catch(errorHandler);
