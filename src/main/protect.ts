import type { Args } from "../index.js";
import { getDeploys } from "../utils/internal/deploy/getDeploys.js";

export const runProtect = async (args: Args) => {
  const deploys = await getDeploys(args);

  if (deploys.production)
    throw new Error("Production deploy was found unencrypted. Abort.");
  if (deploys.staging)
    throw new Error("Production deploy was found unencrypted. Abort.");
};
