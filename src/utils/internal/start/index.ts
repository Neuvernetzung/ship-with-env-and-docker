import { NodeSSH } from "node-ssh";
import { Server } from "../../../types/config.js";
import { getComposePath } from "../index.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { execCommand, getTargetPath } from "../ssh/index.js";

export const start = async (ssh: NodeSSH, deploy: Server) => {
  const targetPath = getTargetPath(deploy.server.path);

  if (deploy.beforeStart) {
    await performSingleOrMultiple(
      deploy.beforeStart,
      async (command) => await execCommand(ssh, command, { cwd: targetPath })
    );
  }

  await execCommand(
    ssh,
    `docker-compose -f ${getComposePath(".")} up -V --build`, //  -d // SPÄTER WIEDER HINZUFÜGEN
    { cwd: targetPath }
  );

  if (deploy.afterStart) {
    await performSingleOrMultiple(
      deploy.afterStart,
      async (command) => await execCommand(ssh, command, { cwd: targetPath })
    );
  }

  await execCommand(ssh, "docker system prune -af --volumes", {
    cwd: targetPath,
  });
};
