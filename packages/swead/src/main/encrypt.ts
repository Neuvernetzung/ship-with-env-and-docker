import fs from "fs";

import path from "path";
import inquirerPassword from "@inquirer/password";
import inquirerCheckbox from "@inquirer/checkbox";
import {
  logger,
  SWEAD_BASE_PATH,
  CONFIG_NAME,
} from "../utils/internal/index.js";
import pick from "lodash/pick.js";
import Cryptr from "cryptr";
import merge from "lodash/merge.js";
import { Deploys } from "../types/deploys.js";
import { Args } from "../index.js";
import { getDeploys } from "../utils/internal/deploy/getDeploys.js";
import entries from "lodash/entries.js";
import omit from "lodash/omit.js";
import set from "lodash/set.js";
import { getEncryptedDeploys } from "../utils/internal/deploy/getEncryptedDeploys.js";
import { updateDeploys } from "../utils/internal/deploy/updateDeploys.js";
import { updateEncryptedDeploys } from "../utils/internal/deploy/updateEncryptedDeploys.js";

export const runEncrypt = async (args: Args) => {
  const sweadBasePath = args.config || SWEAD_BASE_PATH;
  const deploysPath = path.resolve(sweadBasePath, CONFIG_NAME);

  logger.start("Swead encrypt started.");

  if (!fs.existsSync(deploysPath))
    throw new Error(`Config file "${deploysPath}" does not exist.`);

  const deploys = await getDeploys(args);
  const encryptedDeploys = await getEncryptedDeploys(args);

  const choices: { value: keyof Deploys; checked?: boolean }[] = [
    { value: "production", checked: true },
    { value: "staging", checked: true },
    { value: "local" },
    { value: "dev" },
  ];

  const { methods, password, cfPassword } = {
    methods: await inquirerCheckbox({
      choices: choices.filter((choice) => !!deploys[choice.value]),
      message: "Please choose the methods you want to encrypt.",
    }),
    password: await inquirerPassword({
      mask: "*",
      message:
        "Enter the password with which the server data is to be encrypted.",
    }),
    cfPassword: await inquirerPassword({
      mask: "*",
      message: "Please confirm the password.",
    }),
  };

  if (password !== cfPassword) {
    throw new Error(`The two passwords do not match.`);
  }

  const deploysToEncrypt = pick(deploys, methods);
  const finalDeploys = omit(deploys, methods);

  const cryptr = new Cryptr(password);

  const newEncryptedDeploys = entries(deploysToEncrypt)
    .map(([deploy, data]) => ({
      deploy,
      data: cryptr.encrypt(JSON.stringify(data)),
    }))
    .reduce((prev, { deploy, data }) => {
      set(prev, deploy, data);
      return prev;
    }, {});

  const finalEncryptedDeploys = merge(encryptedDeploys, newEncryptedDeploys);

  await updateDeploys(finalDeploys, args);
  await updateEncryptedDeploys(finalEncryptedDeploys, args);

  logger.finished("The server data has been successfully encrypted.");
};
