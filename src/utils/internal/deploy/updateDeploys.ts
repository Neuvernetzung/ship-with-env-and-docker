import { Project } from "ts-morph";
import prettier from "prettier";
import { readFile, writeFile } from "fs/promises";
import { Args } from "../../../index";
import { SWEAD_BASE_PATH, join } from "../index";
import { DEPLOYS_FILE_NAME } from "./loadDeploy";
import { Deploys } from "../../../types/deploys";

export const updateDeploys = async (newDeploys: Deploys, args: Args) => {
  const sweadBasePath = args.config || SWEAD_BASE_PATH;
  const deploysPath = join(sweadBasePath, DEPLOYS_FILE_NAME);

  const project = new Project({});

  const deploysFile = project.addSourceFileAtPath(deploysPath);

  const deploysObject = deploysFile.getVariableDeclaration("deploys");

  deploysObject?.setInitializer(JSON.stringify(newDeploys, null, 1));

  await project.save();

  // Formatieren
  const unformattedFile = await readFile(deploysPath, "utf8");

  const formattedCode = await prettier.format(unformattedFile, {
    parser: "typescript",
    semi: true,
  });

  await writeFile(deploysPath, formattedCode);
};
