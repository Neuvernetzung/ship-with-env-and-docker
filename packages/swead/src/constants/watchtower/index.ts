import { join } from "@/utils/internal/index.js";
import { getHelpersPath } from "../helper/index.js";

export const WATCHTOWER_HELPER_NAME = "watchtower";

export const WATCHTOWER_HELPER_DIR = getHelpersPath(WATCHTOWER_HELPER_NAME);

export const watchtowerConfigName = "config.json";

export const watchtowerHelperFile = join(
  WATCHTOWER_HELPER_DIR,
  watchtowerConfigName
);
