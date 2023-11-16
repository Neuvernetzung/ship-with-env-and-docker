import { bundleRequire } from "bundle-require";
import {
  EncryptedDeploys,
  zLocalDeploy,
  zServerDeployUnion,
} from "../../../types/deploys.js";
import { Args, RunMethods } from "../../../index.js";
import {
  SWEAD_BASE_PATH,
  decryptData,
  formatZodErrors,
  join,
} from "../index.js";
import inquirer from "inquirer";

export const ENCRYPTED_DEPLOYS_FILE_NAME = "encrypted.ts";

export const loadEncryptedDeploy = async (deploy: RunMethods, args?: Args) => {
  const deploysBasePath = args?.config || SWEAD_BASE_PATH;

  const encryptedDeploysPath = join(
    deploysBasePath,
    ENCRYPTED_DEPLOYS_FILE_NAME
  );

  const { mod } = await bundleRequire({
    filepath: encryptedDeploysPath,
  });
  const encryptedDeploys: EncryptedDeploys = mod.default;
  if (!(deploy in encryptedDeploys)) {
    throw new Error(`"${deploy}" is not defined in "${encryptedDeploysPath}"`);
  }

  const { password } = args?.password
    ? { password: args.password }
    : await inquirer.prompt([
        {
          type: "password",
          name: "password",
          mask: "*",
          message:
            "Enter the password with which the server data is to be decrypted.",
        },
      ]);

  const decryptedDeploy = decryptData(
    password,
    encryptedDeploys[deploy] as string
  );

  const parsedDeploys =
    deploy === "dev" || deploy === "local"
      ? await zLocalDeploy.safeParseAsync(decryptedDeploy)
      : deploy === "production" || deploy === "staging"
      ? await zServerDeployUnion.safeParseAsync(decryptedDeploy)
      : undefined;

  if (!parsedDeploys || !parsedDeploys?.success) {
    throw new Error(`Invalid encrypted deploys:\n
      ${parsedDeploys && formatZodErrors(parsedDeploys.error.issues)}`);
  }

  return parsedDeploys.data;
};
