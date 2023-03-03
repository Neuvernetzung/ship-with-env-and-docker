import isArray from "lodash/isArray.js";
import { Deploy, EnvConfig } from "../../../types/index.js";
import { testDns } from "../config/testDns.js";
import {
  createArtifact,
  withTempDir,
  build,
  performSingleOrMultiple,
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

export const run = async (
  deploys: Deploy | Deploy[],
  env: EnvConfig | undefined
) => {
  await withTempDir(
    async (dir) =>
      await runTasks(
        await singleOrMultipleTasks(deploys, async (deploy, i) => ({
          title: `Running deployment for '${bold(deploy.name)}'${
            isArray(deploys) && taskIndex(i, deploys.length)
          }.`,
          task: async (_, task) =>
            task.newListr(
              await singleOrMultipleTasks(deploy.deploy, async (server, i) => ({
                title: `Running deployment for '${bold(server.server.ip)}'${
                  isArray(deploy.deploy) && taskIndex(i, deploy.deploy.length)
                }`,
                task: async (_, task) =>
                  task.newListr([
                    {
                      title: `Testing server dns`,
                      task: async () => await testDns(server),
                    },
                    {
                      title: `Testing ssh connection`,
                      task: async () => await testSSH(server.server),
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
                                isArray(server.apps) &&
                                taskIndex(i, server.apps.length)
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
                    ...(await withSSHConnection(server.server, async (ssh) => [
                      {
                        title: "Preparing server",
                        task: async () =>
                          await prepareServer(ssh, server, task.stdout()),
                      },
                      {
                        title: "Transfer artifact and extract",
                        task: async () =>
                          await transferArtifactAndExtract(
                            ssh,
                            dir,
                            server.server.path,
                            task.stdout()
                          ),
                      },
                      {
                        title: "Starting apps",
                        task: async () =>
                          await start(ssh, server, task.stdout()),
                        options: { bottomBar: Infinity },
                      },
                    ])),
                  ]),
              }))
            ),
        }))
      )
  );
};
