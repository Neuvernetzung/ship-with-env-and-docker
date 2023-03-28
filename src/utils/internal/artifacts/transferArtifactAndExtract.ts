import { NodeSSH } from "node-ssh";
import { getTargetPath } from "../ssh/getTargetPath.js";
import { putFile } from "../ssh/putFile.js";
import { getArtifactName, getArtifactPath } from "./getArtifactPath.js";
import { execCommand } from "../ssh/execCommand.js";
import { LOCAL_DIR } from "./createArtifact.js";

export const transferArtifactAndExtract = async (
  ssh: NodeSSH,
  dir: string,
  target?: string,
  stdout?: NodeJS.WriteStream & NodeJS.WritableStream
) => {
  const targetPath = getTargetPath(target);

  await putFile(ssh, getArtifactPath(dir), getArtifactPath(targetPath));

  await execCommand(ssh, `tar -zxvf ${getArtifactName()}`, {
    cwd: targetPath,
    stdout,
  });

  await execCommand(ssh, `rm -rfv ${getArtifactName()}`, {
    cwd: targetPath,
    stdout,
  });

  await execCommand(ssh, `cp -rfv ${LOCAL_DIR}/* .`, {
    cwd: targetPath,
    stdout,
  }); // Aus notwendigen LocalDir heraus kopieren in das RootDir

  await execCommand(ssh, `rm -rfv ${LOCAL_DIR}`, { cwd: targetPath, stdout });
};
