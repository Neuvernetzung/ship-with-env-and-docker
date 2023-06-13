import { ListrTask } from "listr2";
import isArray from "lodash/isArray.js";
import { Deploy, EnvConfig, ServerDetails } from "../../../types/index.js";
import { testDns, testDomainDns } from "../config/testDns.js";
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

export type RunOptions = {
  skip?: number;
  attached?: boolean;
  remove?: boolean;
  verbose?: boolean;
  specific?: number;
};

export const run = async (
  deploys: Deploy | Deploy[],
  env: EnvConfig | undefined,
  opts: RunOptions
) => {
  await withTempDir(async (dir) => {
    if (opts.skip || opts.specific) {
      // Testen ob skip unnötig ist und ob skip eventuell größer als die Anzahl der Server.
      if (!isArray(deploys))
        throw new Error(
          "It is not possible to skip if there is only one deployment."
        );
      if (
        deploys.length < (opts.skip || 0) ||
        deploys.length < (opts.specific || 0)
      )
        throw new Error(
          "The number of deployments to be skipped is greater than the number of available deployments."
        );
    }

    await runTasks(
      await singleOrMultipleTasks(deploys, async (deploy, i) => ({
        title: `Running deployment for '${bold(deploy.name)}'${
          isArray(deploys) ? taskIndex(i, deploys.length) : ""
        }.`,
        skip: opts.skip
          ? opts.skip > i + 1
          : opts.specific
          ? opts.specific !== i + 1
          : false,
        task: async (_, task) =>
          task.newListr(
            await singleOrMultipleTasks(deploy.deploy, async (server, i) => ({
              title: `Running deployment for '${bold(
                (server.server as ServerDetails).ip
              )}'${
                isArray(deploy.deploy) ? taskIndex(i, deploy.deploy.length) : ""
              }`,
              task: async (_, task) =>
                task.newListr([
                  {
                    title: `Testing server dns`,
                    task: async () => {
                      await testDns(server);
                      if (!server.exposeFolder) return;
                      await testDomainDns(
                        server.exposeFolder?.url,
                        (server.server as ServerDetails).ip
                      );
                    },
                  },
                  {
                    title: `Testing ssh connection`,
                    task: async () =>
                      await testSSH(server.server as ServerDetails),
                  },
                  {
                    skip: !server.waitOn,
                    task: async () => await waitOn(server.waitOn),
                  },
                  {
                    title: `Building apps`,
                    task: async (_, task) =>
                      task.newListr(
                        await singleOrMultipleTasks(
                          server.apps,
                          async (app, i) => ({
                            title: `Building app ${bold(app.name)}${
                              isArray(server.apps)
                                ? taskIndex(i, server.apps.length)
                                : ""
                            }`,
                            task: async (_, task) =>
                              await build(app, env, {
                                stdout: task.stdout(),
                              }),
                            options: { bottomBar: Infinity },
                          })
                        )
                      ),
                  },
                  {
                    title: "Creating artifacts",
                    task: async () => await createArtifact(dir, server, env),
                  },
                  ...(await withSSHConnection(
                    server.server as ServerDetails,
                    async (ssh) =>
                      [
                        {
                          title: "Preparing server",
                          task: async (_, task) =>
                            await prepareServer(ssh, server, task.stdout()),
                          options: { bottomBar: Infinity },
                        },
                        {
                          title: "Transfer artifact and extract",
                          task: async (_, task) =>
                            await transferArtifactAndExtract(
                              ssh,
                              dir,
                              server.serverConfig?.path,
                              task.stdout(),
                              opts.verbose
                            ),
                          options: { bottomBar: Infinity },
                        },
                        {
                          title: "Starting apps",
                          task: async (_, task) =>
                            await start(
                              ssh,
                              server,
                              task.stdout(),
                              opts.attached,
                              opts.remove
                            ),
                          options: { bottomBar: Infinity },
                        },
                      ] satisfies ListrTask[]
                  )),
                ]),
            }))
          ),
      })),
      {},
      opts.verbose
    );
  });
};
