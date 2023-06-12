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
  const {
    config: configName,
    skip,
    specific,
    attached,
    remove,
    password,
    verbose,
  } = args;

  if (!method)
    throw new Error(`Please define a method. (${totalMethods.join(", ")})`);

  if (!totalMethods.includes(method)) {
    throw new Error(
      `This method is not included in (${totalMethods.join(", ")})`
    );
  }

  if (method === "init") {
    await runInit(args.config);
    return;
  }
  if (method === "encrypt") {
    await runEncrypt(args.config);
    return;
  }
  if (method === "decrypt") {
    await runDecrypt(args.config);
    return;
  }

  if (runMethods.includes(method)) {
    if (method === "production") {
      const { env, config } = await getConfig({
        config: configName,
        password,
        method: "production",
      });
      await runProduction(env, config, {
        skip,
        specific,
        attached,
        remove,
        verbose,
      });
      return;
    }

    if (method === "staging") {
      const { env, config } = await getConfig({
        config: configName,
        password,
        method: "staging",
      });
      await runStaging(env, config, {
        skip,
        specific,
        attached,
        remove,
        verbose,
      });
      return;
    }
    if (method === "local") {
      const { env, config } = await getConfig({
        config: configName,
        password,
        method: "local",
      });
      await runLocal(env, config);
      return;
    }
    if (method === "dev") {
      const { env, config } = await getConfig({
        config: configName,
        password,
        method: "dev",
      });
      await runDev(env, config);
      return;
    }
  }
};

main().catch(errorHandler);
