import { writeFile } from "fs/promises";
import { CONFIG_NAME, ENV_SCHEMAS_NAME, SWEAD_BASE_PATH } from "./getConfig.js";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { DEPLOYS_FILE_NAME } from "../deploy/loadDeploy.js";
import { ENCRYPTED_DEPLOYS_FILE_NAME } from "../deploy/loadEncryptedDeploy.js";
import { Args } from "../../../index.js";

export const createConfigs = async (args: Args) => {
  const sweadBasePath = args.config || SWEAD_BASE_PATH;
  if (!existsSync(sweadBasePath)) {
    mkdirSync(sweadBasePath);
  }

  const configPath = path.resolve(sweadBasePath, CONFIG_NAME);

  if (existsSync(configPath)) {
    throw new Error(`Config file "${configPath}" already exists.`);
  }

  await writeFile(configPath, configBoilerPlate);

  const deploysPath = path.resolve(sweadBasePath, DEPLOYS_FILE_NAME);

  if (existsSync(deploysPath)) {
    throw new Error(`Deploys file "${deploysPath}" already exists.`);
  }

  await writeFile(deploysPath, deploysBoilerPlate);

  const encryptedPath = path.resolve(
    sweadBasePath,
    ENCRYPTED_DEPLOYS_FILE_NAME
  );

  if (existsSync(encryptedPath)) {
    throw new Error(
      `Encrypted deploys file "${encryptedPath}" already exists.`
    );
  }

  await writeFile(encryptedPath, encryptedDeploysBoilerPlate);

  const envSchemasPath = path.resolve(sweadBasePath, ENV_SCHEMAS_NAME);

  if (existsSync(envSchemasPath)) {
    throw new Error(`Env schemas file "${envSchemasPath}" already exists.`);
  }

  await writeFile(envSchemasPath, envSchemasBoilerPlate);
};

const configBoilerPlate = `
import { SweadConfig } from "swead";
import envSchemas from "./envSchemas.js";

const config = {
  branches: {
    staging: "develop",
    production: "master",
  },
  dev: [],
  local: [],
  server: {},
} satisfies SweadConfig<typeof envSchemas>;

export default config
`;

const deploysBoilerPlate = `
import { Deploys } from "swead";
import config from "./config.js";
import envSchemas from "./envSchemas.js";

const deploys: Deploys<typeof envSchemas, typeof config> = {
  dev: { envs: [] },
  local: { envs: [] },
  staging: {},
};

export default deploys;

`;

const encryptedDeploysBoilerPlate = `
import { EncryptedDeploys } from "swead";

const encrypted: EncryptedDeploys = {};

export default encrypted;
`;

const envSchemasBoilerPlate = `
import { z } from "zod";
import { EnvSchemas, zUrl } from "swead";

const envSchemas = {
  example: z.object({
    domain: zUrl,
    subDomain: zUrl,
  }),
} satisfies EnvSchemas;

export default envSchemas;
`;
