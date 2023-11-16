import { bundleRequire } from "bundle-require";
import { Args } from "../../../index";
import { SWEAD_BASE_PATH, formatZodErrors, join } from "../index";
import { DEPLOYS_FILE_NAME } from "./loadDeploy";
import { zDeploys } from "../../../types/deploys";

export const getDeploys = async (args: Args) => {
  const deploysBasePath = args?.config || SWEAD_BASE_PATH;
  const deploysPath = join(deploysBasePath, DEPLOYS_FILE_NAME);

  if (!deploysPath)
    throw new Error(
      `No deploys file found. Please create "${join(
        deploysBasePath,
        DEPLOYS_FILE_NAME
      )}" in your root directory.`
    );

  const { mod } = await bundleRequire({
    filepath: deploysPath,
  });

  const parsedDeploys = await zDeploys.safeParseAsync(mod.default);

  if (!parsedDeploys?.success) {
    throw new Error(`Invalid config:\n
        ${formatZodErrors(parsedDeploys.error.issues)}`);
  }

  return parsedDeploys.data;
};
