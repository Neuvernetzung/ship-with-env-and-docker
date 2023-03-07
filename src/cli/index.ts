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
  string: ["_", "c", "s"],
  boolean: ["h"],
  alias: {
    c: "config",
    h: "help",
    s: "skip",
  },
};

const main = async () => {
  const args = parseArgs(cliOpts);

  const method = args._;
  const skip = args.skip;

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
    const { env, config } = await getConfig(args.config);

    if (method === "production") {
      await runProduction(env, config, skip);
      return;
    }
    if (method === "staging") {
      await runStaging(env, config, skip);
      return;
    }
    if (method === "local") {
      await runLocal(env, config);
      return;
    }
    if (method === "dev") {
      await runDev(env, config);
      return;
    }
  }
};

main().catch(errorHandler);
