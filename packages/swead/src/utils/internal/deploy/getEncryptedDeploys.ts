import { bundleRequire } from "bundle-require";
import { Args } from "../../../index.js";
import { SWEAD_BASE_PATH, formatZodErrors, join } from "../index.js";
import { zEncryptedDeploys } from "../../../types/deploys.js";
import { ENCRYPTED_DEPLOYS_FILE_NAME } from "./loadEncryptedDeploy.js";

export const getEncryptedDeploys = async (args: Args) => {
  const deploysBasePath = args?.config || SWEAD_BASE_PATH;
  const encryptedDeploysPath = join(
    deploysBasePath,
    ENCRYPTED_DEPLOYS_FILE_NAME
  );

  if (!encryptedDeploysPath)
    throw new Error(
      `No encrypted deploys file found. Please create "${join(
        deploysBasePath,
        ENCRYPTED_DEPLOYS_FILE_NAME
      )}" in your root directory.`
    );

  const { mod } = await bundleRequire({
    filepath: encryptedDeploysPath,
  });

  const parsedDeploys = await zEncryptedDeploys.safeParseAsync(mod.default);

  if (!parsedDeploys?.success) {
    throw new Error(`Invalid config:\n
        ${formatZodErrors(parsedDeploys.error.issues)}`);
  }

  return parsedDeploys.data;
};
