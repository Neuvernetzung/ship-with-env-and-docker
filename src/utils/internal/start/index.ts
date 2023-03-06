import { NodeSSH } from "node-ssh";
import { Server } from "../../../types/index.js";
import { getComposePath } from "../index.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { execCommand, getTargetPath } from "../ssh/index.js";

export const start = async (
  ssh: NodeSSH,
  deploy: Server,
  stdout?: NodeJS.WriteStream & NodeJS.WritableStream
) => {
  const targetPath = getTargetPath(deploy.server.path);

  if (deploy.beforeStart) {
    await performSingleOrMultiple(
      deploy.beforeStart,
      async (command) =>
        await execCommand(ssh, command, { cwd: targetPath, stdout })
    );
  }

  await execCommand(
    ssh,
    `docker-compose -f ${getComposePath(".")} up -V --build ${
      deploy.dontDetach ? "" : "-d"
    }`,
    { cwd: targetPath, stdout }
  );

  if (deploy.afterStart) {
    await performSingleOrMultiple(
      deploy.afterStart,
      async (command) =>
        await execCommand(ssh, command, { cwd: targetPath, stdout })
    );
  }

  await execCommand(ssh, "docker system prune -af --volumes", {
    cwd: targetPath,
    stdout,
  });

  if (deploy.server.rebootAfterUpdate) {
    await execCommand(ssh, "reboot");
  }

  ssh.dispose();
};
