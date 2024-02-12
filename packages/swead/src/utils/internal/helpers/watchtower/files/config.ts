import { watchtowerHelperFile } from "@/constants/watchtower/index.js";
import { ServerDeploy, stripHttpsFromUrl } from "@/index.js";
import { HelperFile } from "../../handleHelperFiles.js";

export const createWatchtowerConfig = (deploy: ServerDeploy): HelperFile => {
  const watchtowerConfig = JSON.stringify({
    auths:
      deploy.docker?.registries?.reduce<Record<string, { auth: string }>>(
        (prev, registry) => {
          const registryName = stripHttpsFromUrl(registry.url);

          prev[registryName] = {
            auth: Buffer.from(`${registry.user}:${registry.pass}`).toString(
              "base64"
            ),
          };

          return prev;
        },
        {}
      ) || {},
  });

  return {
    path: watchtowerHelperFile,
    content: watchtowerConfig,
  };
};
