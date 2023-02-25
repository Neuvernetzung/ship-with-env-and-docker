import {
  createArtifact,
  withTempDir,
  build,
  validateGit,
  getConfig,
  performSingleOrMultiple,
  transferArtifactAndExtract,
  waitOn,
  withSSHConnection,
  errorHandler,
  prepareServer,
} from "../utils/internal/index.js";

export const runStaging = async () => {
  const { env, config } = await getConfig();

  if (!config.staging) throw new Error("Staging is not defined in config.");

  await performSingleOrMultiple(
    config.staging,
    async (staging) => {
      await validateGit(staging.branches);

      await performSingleOrMultiple(staging.deploy, async (deploy) => {
        await waitOn(deploy.waitOn);

        await performSingleOrMultiple(deploy.apps, async (app) => {
          await build(app, env);
        });

        await withTempDir(async (dir) => {
          await createArtifact(dir, deploy, env);

          await withSSHConnection(deploy.server, async (ssh) => {
            await prepareServer(ssh, deploy);

            await transferArtifactAndExtract(ssh, dir, deploy.server.path);

            // Start
          });
        });
      });
    },
    {
      strict: true,
      title: "Stage Server",
    }
  );
};

runStaging().catch(errorHandler);
