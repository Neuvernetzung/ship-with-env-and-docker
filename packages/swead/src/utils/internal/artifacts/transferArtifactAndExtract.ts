import { NodeSSH } from "node-ssh";
import { getTargetPath } from "../ssh/getTargetPath.js";
import { putFile } from "../ssh/putFile.js";
import { getArtifactName, getArtifactPath } from "./getArtifactPath.js";
import { execCommand } from "../ssh/execCommand.js";
import { LOCAL_ARTIFACT_DIR } from "./createArtifact.js";

export const transferArtifactAndExtract = async (
  ssh: NodeSSH,
  dir: string,
  target?: string,
  stdout?: NodeJS.WritableStream,
  verbose?: boolean
) => {
  const targetPath = getTargetPath(target);

  await putFile(ssh, getArtifactPath(dir), getArtifactPath(targetPath));

  await execCommand(ssh, `tar -zx${verbose ? "v" : ""}f ${getArtifactName()}`, {
    cwd: targetPath,
    stdout,
  });

  await execCommand(ssh, `rm -rf${verbose ? "v" : ""} ${getArtifactName()}`, {
    cwd: targetPath,
    stdout,
  });

  await execCommand(
    ssh,
    `cp -rf${verbose ? "v" : ""} ${LOCAL_ARTIFACT_DIR}/* .`,
    {
      cwd: targetPath,
      stdout,
    }
  ); // Aus notwendigen LocalDir heraus kopieren in das RootDir

  await execCommand(ssh, `rm -rf${verbose ? "v" : ""} ${LOCAL_ARTIFACT_DIR}`, {
    cwd: targetPath,
    stdout,
  });
};
