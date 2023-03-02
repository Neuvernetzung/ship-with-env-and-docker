import { Deploy, EnvConfig } from "../../../types/index.js";
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
} from "../index.js";

export const run = async (
  deploys: Deploy | Deploy[],
  env: EnvConfig | undefined
) =>
  await performSingleOrMultiple(
    deploys,
    async (deploy) => {
      await performSingleOrMultiple(deploy.deploy, async (deploy) => {
        await waitOn(deploy.waitOn);

        await performSingleOrMultiple(deploy.apps, async (app) => {
          await build(app, env);
        });

        await withTempDir(async (dir) => {
          await createArtifact(dir, deploy, env);

          await withSSHConnection(deploy.server, async (ssh) => {
            await prepareServer(ssh, deploy);

            await transferArtifactAndExtract(ssh, dir, deploy.server.path);

            await start(ssh, deploy);
          });
        });
      });
    },
    {
      strict: true,
      title: "Stage Server",
    }
  );
