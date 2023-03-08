import { SweadConfig } from "../../../types/config.js";
import { Project } from "ts-morph";
import path from "path";
import { CONFIG_DEFAULT_NAME } from "./getConfig.js";
import prettier from "prettier";
import { readFile, writeFile } from "fs/promises";

type UpdateConfigOpts = {
  name?: string;
};

export const updateConfig = async (
  config: SweadConfig,
  opts: UpdateConfigOpts
) => {
  const configPath = path.join(process.cwd(), opts.name || CONFIG_DEFAULT_NAME);

  const project = new Project({});

  const configFile = project.addSourceFileAtPath(configPath);

  const configObject = configFile.getVariableDeclaration("config");

  configObject?.setInitializer(JSON.stringify(config, null, 1));

  await project.save();

  // Formatieren
  const unformattedFile = await readFile(configPath, "utf8");

  const formattedCode = prettier.format(unformattedFile, {
    parser: "typescript",
    semi: true,
  });

  await writeFile(configPath, formattedCode);
};
