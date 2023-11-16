import type { Args } from "../index";
import { getDeploys } from "../utils/internal/deploy/getDeploys";

export const runProtect = async (args: Args) => {
  const deploys = await getDeploys(args);

  if (deploys.production)
    throw new Error("Production deploy was found unencrypted. Abort.");
  if (deploys.staging)
    throw new Error("Production deploy was found unencrypted. Abort.");
};
