import { NodeSSH } from "node-ssh";
import { Server } from "../../../types/index.js";
import { getComposePath } from "../index.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { execCommand, getTargetPath } from "../ssh/index.js";
import { ServerDeploy } from "../../../types/deploys.js";

export const start = async (
  ssh: NodeSSH,
  server: Server,
  deploy: ServerDeploy,
  stdout: NodeJS.WritableStream,
  attached: boolean | undefined,
  remove: boolean | undefined
) => {
  const targetPath = getTargetPath(deploy.server?.path);

  if (server.removeDockerImagesBefore ?? remove) {
    await execCommand(
      ssh,
      `docker stop $(docker ps -aq) && docker rm $(docker ps -aq)`,
      { cwd: targetPath, stdout }
    );
  }

  if (server.beforeStart) {
    await performSingleOrMultiple(
      server.beforeStart,
      async (command) =>
        await execCommand(ssh, command, { cwd: targetPath, stdout })
    );
  }

  await execCommand(
    ssh,
    `COMPOSE_HTTP_TIMEOUT=120 docker-compose -f ${getComposePath(
      "."
    )} up -V --build ${server.attached ?? attached ? "" : "-d"} ${
      server.removeOrphans ? "--remove-orphans" : ""
    }`,
    { cwd: targetPath, stdout }
  );

  if (server.afterStart) {
    await performSingleOrMultiple(
      server.afterStart,
      async (command) =>
        await execCommand(ssh, command, { cwd: targetPath, stdout })
    );
  }

  await execCommand(ssh, "docker system prune -af --volumes", {
    cwd: targetPath,
    stdout,
  });

  if (server.serverConfig?.rebootAfterUpdate) {
    await execCommand(ssh, "reboot");
  }

  ssh.dispose();
};
