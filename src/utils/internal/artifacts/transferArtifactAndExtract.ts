import { NodeSSH } from "node-ssh";
import { getTargetPath } from "../ssh/getTargetPath.js";
import { putFile } from "../ssh/putFile.js";
import { getArtifactName, getArtifactPath } from "./getArtifactPath.js";
import { execCommand } from "../ssh/execCommand.js";

export const transferArtifactAndExtract = async (
  ssh: NodeSSH,
  dir: string,
  target?: string
) => {
  const targetPath = getTargetPath(target);

  await putFile(ssh, getArtifactPath(dir), getArtifactPath(targetPath));

  await execCommand(ssh, `tar -zxf ${getArtifactName()}`, { cwd: targetPath });

  await execCommand(ssh, `rm -rf ${getArtifactName()}`, { cwd: targetPath });
};
