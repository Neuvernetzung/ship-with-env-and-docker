import { execa } from "execa";

export const getCurrentGitBranch = async () => {
  const { stdout, stderr } = await execa("git rev-parse --abbrev-ref HEAD");
  if (stderr) throw new Error(`getBranch Error: ${stderr}`);
  return stdout.trim();
};
