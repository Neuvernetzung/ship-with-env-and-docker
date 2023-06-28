import { bundleRequire } from "bundle-require";
import { Args, runMethods } from "../../../index.js";
import { SWEAD_BASE_PATH, formatZodErrors, join } from "../index.js";
import { Deploys, zDeploys } from "../../../types/deploys.js";
import {
  ENCRYPTED_DEPLOYS_FILE_NAME,
  loadEncryptedDeploy,
} from "./loadEncryptedDeploy.js";

export const DEPLOYS_FILE_NAME = "deploys.ts";

export const loadDeploy = async <T extends keyof Deploys = keyof Deploys>(
  deploy: T,
  args?: Args
): Promise<Required<Deploys>[T]> => {
  if (!deploy)
    throw new Error(`Please define a run method: "${runMethods.join(", ")}"`);

  const deploysBasePath = args?.config || SWEAD_BASE_PATH;
  const deploysPath = join(deploysBasePath, DEPLOYS_FILE_NAME);
  const encryptedDeploysPath = join(
    deploysBasePath,
    ENCRYPTED_DEPLOYS_FILE_NAME
  );

  if (!deploysPath && !encryptedDeploysPath)
    throw new Error(
      `No deploys file found. Please create "${join(
        deploysBasePath,
        DEPLOYS_FILE_NAME
      )}" in your root directory.`
    );

  if (!deploysPath) {
    const encryptedDeploy = await loadEncryptedDeploy(deploy, args);

    return encryptedDeploy as Required<Deploys>[T];
  }

  const { mod } = await bundleRequire({
    filepath: deploysPath,
  });

  const parsedDeploys = await zDeploys.safeParseAsync(mod.default);

  if (!parsedDeploys?.success) {
    throw new Error(`Invalid config:\n
    ${formatZodErrors(parsedDeploys.error.issues)}`);
  }

  const returnedDeploy = parsedDeploys.data[deploy];

  if (returnedDeploy) return returnedDeploy as Required<Deploys>[T];

  const encryptedDeploy = await loadEncryptedDeploy(deploy, args);

  return encryptedDeploy as Required<Deploys>[T];
};
