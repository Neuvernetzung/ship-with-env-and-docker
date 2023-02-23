import { build } from "../utils/internal/build/index.js";
import { errorHandler } from "../utils/internal/errorHandler.js";
import { validateGit } from "../utils/internal/git/validateGit.js";
import {
  createArtifacts,
  getConfig,
  performSingleOrMultiple,
} from "../utils/internal/index.js";
import { waitOn } from "../utils/internal/waitOn.js";

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

        // Funktion erstellen withTempDir
        await createArtifacts(deploy.artifact);
      });
    },
    {
      strict: true,
      title: "Stage Server",
    }
  );
};

runStaging().catch(errorHandler);
