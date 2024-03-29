import inquirer from "inquirer";
import {
  SWEAD_BASE_PATH,
  decryptData,
  logger,
} from "../utils/internal/index.js";
import { Args } from "../index.js";
import { ENCRYPTED_DEPLOYS_FILE_NAME } from "../utils/internal/deploy/loadEncryptedDeploy.js";
import fs from "fs";
import path from "path";
import { getDeploys } from "../utils/internal/deploy/getDeploys.js";
import { getEncryptedDeploys } from "../utils/internal/deploy/getEncryptedDeploys.js";
import { EncryptedDeploys } from "../types/deploys.js";
import entries from "lodash/entries.js";
import merge from "lodash/merge.js";
import omit from "lodash/omit.js";
import pick from "lodash/pick.js";
import set from "lodash/set.js";
import { updateDeploys } from "../utils/internal/deploy/updateDeploys.js";
import { updateEncryptedDeploys } from "../utils/internal/deploy/updateEncryptedDeploys.js";

export const runDecrypt = async (args: Args) => {
  const sweadBasePath = args.config || SWEAD_BASE_PATH;
  const encryptedDeploysPath = path.resolve(
    sweadBasePath,
    ENCRYPTED_DEPLOYS_FILE_NAME
  );

  logger.start("Swead decrypt started.");

  if (!fs.existsSync(encryptedDeploysPath))
    throw new Error(`Config file "${encryptedDeploysPath}" does not exist.`);

  const deploys = await getDeploys(args);
  const encryptedDeploys = await getEncryptedDeploys(args);

  const choices: { name: keyof EncryptedDeploys; checked?: boolean }[] = [
    { name: "production", checked: true },
    { name: "staging", checked: true },
    { name: "local" },
    { name: "dev" },
  ];

  const { methods, password } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "methods",
      choices: choices.filter((choice) => !!encryptedDeploys[choice.name]),
      message: "Please choose the methods you want to decrypt.",
    },
    {
      type: "password",
      name: "password",
      mask: "*",
      message:
        "Enter the password with which the server data is to be decrypted.",
    },
  ]);

  const deploysToDecrypt = pick(encryptedDeploys, methods);
  const finalEncryptedDeploys = omit(encryptedDeploys, methods);

  const newDeploys = entries(deploysToDecrypt)
    .map(([deploy, data]) => ({
      deploy,
      data: decryptData(password, data),
    }))
    .reduce((prev, { deploy, data }) => {
      set(prev, deploy, data);
      return prev;
    }, {});

  const finalDeploys = merge(deploys, newDeploys);

  await updateDeploys(finalDeploys, args);
  await updateEncryptedDeploys(finalEncryptedDeploys, args);

  logger.finished("The server data has been decrypted and can now be edited.");
};
