import { Project } from "ts-morph";
import prettier from "prettier";
import { readFile, writeFile } from "fs/promises";
import { Args } from "../../../index";
import { SWEAD_BASE_PATH, join } from "../index";
import { ENCRYPTED_DEPLOYS_FILE_NAME } from "./loadEncryptedDeploy";
import { EncryptedDeploys } from "../../../types/deploys";

export const updateEncryptedDeploys = async (
  newDeploys: EncryptedDeploys,
  args: Args
) => {
  const sweadBasePath = args.config || SWEAD_BASE_PATH;
  const encryptedDeploysPath = join(sweadBasePath, ENCRYPTED_DEPLOYS_FILE_NAME);

  const project = new Project({});

  const encryptedDeploysFile =
    project.addSourceFileAtPath(encryptedDeploysPath);

  const encryptedDeploysObject =
    encryptedDeploysFile.getVariableDeclaration("encrypted");

  encryptedDeploysObject?.setInitializer(JSON.stringify(newDeploys, null, 1));

  await project.save();

  // Formatieren
  const unformattedFile = await readFile(encryptedDeploysPath, "utf8");

  const formattedCode = await prettier.format(unformattedFile, {
    parser: "typescript",
    semi: true,
  });

  await writeFile(encryptedDeploysPath, formattedCode);
};
