import isArray from "lodash/isArray.js";
import { getCurrentGitBranch } from "./getCurrentGitBranch.js";

export const validateGit = async (branches: string | string[] | undefined) => {
  if (!branches) return;

  const currentGitBranch = await getCurrentGitBranch();

  if (isArray(branches)) {
    if (!branches.includes(currentGitBranch))
      throw new Error(
        `The current git branch "${currentGitBranch}" is not included in allowed branches "${branches.join(
          ", "
        )}"`
      );
  }

  if (branches !== currentGitBranch)
    throw new Error(
      `The current git branch "${currentGitBranch}" is not the allowed branch "${branches}"`
    );
};
