import fs from "fs";

import path from "path";
import inquirer from "inquirer";
import { logger, SWEAD_BASE_PATH, CONFIG_NAME } from "../utils/internal/index";
import pick from "lodash/pick";
import Cryptr from "cryptr";
import merge from "lodash/merge";
import { Deploys } from "../types/deploys";
import { Args } from "../index";
import { getDeploys } from "../utils/internal/deploy/getDeploys";
import entries from "lodash/entries";
import omit from "lodash/omit";
import set from "lodash/set";
import { getEncryptedDeploys } from "../utils/internal/deploy/getEncryptedDeploys";
import { updateDeploys } from "../utils/internal/deploy/updateDeploys";
import { updateEncryptedDeploys } from "../utils/internal/deploy/updateEncryptedDeploys";

export const runEncrypt = async (args: Args) => {
  const sweadBasePath = args.config || SWEAD_BASE_PATH;
  const deploysPath = path.resolve(sweadBasePath, CONFIG_NAME);

  logger.start("Swead encrypt started.");

  if (!fs.existsSync(deploysPath))
    throw new Error(`Config file "${deploysPath}" does not exist.`);

  const deploys = await getDeploys(args);
  const encryptedDeploys = await getEncryptedDeploys(args);

  const choices: { name: keyof Deploys; checked?: boolean }[] = [
    { name: "production", checked: true },
    { name: "staging", checked: true },
    { name: "local" },
    { name: "dev" },
  ];

  const { methods, password, cfPassword } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "methods",
      choices: choices.filter((choice) => !!deploys[choice.name]),
      message: "Please choose the methods you want to encrypt.",
    },
    {
      type: "password",
      name: "password",
      mask: "*",
      message:
        "Enter the password with which the server data is to be encrypted.",
    },
    {
      type: "password",
      name: "cfPassword",
      mask: "*",
      message: "Please confirm the password.",
    },
  ]);

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
