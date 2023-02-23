import { NodeSSH } from "node-ssh";
import { getTargetPath } from "../ssh/getTargetPath.js";
import { putFile } from "../ssh/putFile.js";
import { logger } from "../logger.js";
import { getArtifactPath } from "./getArtifactPath.js";
import { execCommand } from "../ssh/execCommand.js";

export const transferArtifactAndExtract = async (
  ssh: NodeSSH,
  dir: string,
  target?: string
) => {
  const targetPath = getArtifactPath(getTargetPath(target));

  await putFile(ssh, getArtifactPath(dir), targetPath).then(
    function () {
      logger.success("Erfolgreich übertragen.");
    },
    function (error) {
      logger.error("Es ist ein Fehler aufgetreten.");
      throw new Error(error);
    }
  );

  await execCommand(ssh, `tar -zxf ${targetPath}`);

  await execCommand(ssh, `rm -rf ${targetPath}`);
};
