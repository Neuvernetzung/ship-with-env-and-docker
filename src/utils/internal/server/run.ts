import { ListrTask } from "listr2";
import isArray from "lodash/isArray.js";
import { Args, EnvSchemas, Servers } from "../../../types/index.js";
import { testDns } from "../config/testDns.js";
import {
  createArtifact,
  withTempDir,
  build,
  transferArtifactAndExtract,
  waitOn,
  withSSHConnection,
  prepareServer,
  start,
  testSSH,
  runTasks,
  singleOrMultipleTasks,
  taskIndex,
  bold,
} from "../index.js";
import { ServerDeployUnion } from "../../../types/deploys.js";

export const run = async (
  servers: Servers,
  envSchemas: EnvSchemas | undefined,
  deploys: ServerDeployUnion,
  args: Args
) => {
  await withTempDir(async (dir) => {
    if (args.skip || args.specific) {
      // Testen ob skip unnötig ist und ob skip eventuell größer als die Anzahl der Server.
      if (!isArray(deploys))
        throw new Error(
          "It is not possible to skip if there is only one deployment."
        );
      if (
        deploys.length < (args.skip || 0) ||
        deploys.length < (args.specific || 0)
      )
        throw new Error(
          "The number of deployments to be skipped is greater than the number of available deployments."
        );
    }

    await runTasks(
      await singleOrMultipleTasks(deploys, async (deploy, i) => ({
        title: `Running deployment for '${bold(deploy.name)}' on '${bold(
          deploy.server.ip
        )}'${isArray(deploys) ? taskIndex(i, deploys.length) : ""}.`,
        skip: args.skip
          ? args.skip > i + 1
          : args.specific
            ? args.specific !== i + 1
            : false,
        task: async (_, task) => {
          const server = servers[deploy.use.key];
          if (!server)
            throw new Error(
              `No server config could be found for ${deploy.use}.`
            );

          return task.newListr([
            {
              title: `Testing server dns`,
              task: async () => {
                await testDns(server, deploy);
              },
            },
            {
              title: `Testing ssh connection`,
              task: async () => await testSSH(deploy.server),
            },
            {
              skip: !deploy.waitOn && !server.waitOn,
              task: async () => {
                deploy.waitOn && (await waitOn(deploy.waitOn));
                server.waitOn && (await waitOn(server.waitOn));
              },
            },
            {
              title: `Building apps`,
              task: async (_, task) =>
                task.newListr(
                  await singleOrMultipleTasks(server.apps, async (app, i) => ({
                    title: `Building app ${bold(app.name)}${
                      isArray(server.apps)
                        ? taskIndex(i, server.apps.length)
                        : ""
                    }`,
                    task: async (_, task) =>
                      await build(app, deploy, envSchemas, {
                        stdout: task.stdout(),
                      }),
                    options: { bottomBar: Infinity },
                  }))
                ),
            },
            {
              title: "Creating artifacts",
              task: async () =>
                await createArtifact(dir, server, deploy, envSchemas),
            },
            ...(await withSSHConnection(
              deploy.server,
              async (ssh) =>
                [
                  {
                    title: "Preparing server",
                    task: async (_, task) =>
                      await prepareServer(ssh, server, deploy, task.stdout()),
                  },
                  {
                    title: "Transfer artifact and extract",
                    task: async (_, task) =>
                      await transferArtifactAndExtract(
                        ssh,
                        dir,
                        deploy.server.path,
                        task.stdout(),
                        args.verbose
                      ),
                  },
                  {
                    title: "Starting apps",
                    task: async (_, task) =>
                      await start(
                        ssh,
                        server,
                        deploy,
                        task.stdout(),
                        args.attached,
                        args.remove
                      ),
                  },
                ] satisfies ListrTask[]
            )),
          ]);
        },
      })),
      {},
      args.verbose
    );
  });
};
