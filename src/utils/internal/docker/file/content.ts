import { App, BuildUnion } from "../../../../types/index.js";
import {
  DockerFileContent,
  DockerFileInstruction,
} from "../../../../types/docker.js";
import { getWorkdirPath } from "../getWorkdirPath.js";

const DEFAULT_DOCKER_FILE_BASE_IMAGE = "node:18-alpine";

export const createDockerFileContent = async (
  app: Omit<App, "build" | "start"> & Required<BuildUnion>,
  packagePaths: string[],
  artifactPaths: string[]
): Promise<DockerFileContent> => {
  const baseImage = app.docker?.image || DEFAULT_DOCKER_FILE_BASE_IMAGE;

  const dockerFileContent: DockerFileContent = [
    createDockerFileLine("FROM", baseImage),

    createDockerFileLine("RUN", "npm install -g npm@latest"), // npm updaten

    createDockerFileLine("RUN", "apk add --no-cache libc6-compat"), // libc6-compat hinzufügen um turborepo bugs zu fixen

    createDockerFileLine("RUN", "apk update && apk add git"), // linux updaten und git installieren

    createDockerFileLine(
      "RUN",
      `mkdir -p ${getWorkdirPath(app.docker?.workDir)}`
    ), // workdir erstellen

    ...(app.docker?.volumes?.map((vol) =>
      createDockerFileLine("RUN", `mkdir -p ${vol}`)
    ) || []), // Volumes erstellen zur Sicherheit

    createDockerFileLine("WORKDIR", getWorkdirPath(app.docker?.workDir)), // workdir festlegen

    ...(app.docker.skipInstall
      ? []
      : [
          ...packagePaths.map(
            (p) => createDockerFileLine("COPY", [p, "./"]) // package.json und package-lock.json kopieren
          ), // createDockerFileLine(Inst.COPY, ["*/package.json", "."]) funktioniert (noch) nicht

          createDockerFileLine("RUN", "npm i --omit=dev"), // installieren, bis auf dev-Deps
        ]),

    ...(app.docker.copyArtifactOnly
      ? artifactPaths.map((p) => createDockerFileLine("COPY", [p, "."]))
      : [createDockerFileLine("COPY", [".", "."])]), // alles weitere kopieren

    ...(app.docker?.port
      ? app.docker?.port.map((port) =>
          createDockerFileLine("EXPOSE", String(port))
        )
      : []), // ports exposen

    ...(app.docker.beforeStart
      ? app.docker.beforeStart.map((command) =>
          createDockerFileLine(command.instruction, command.content)
        )
      : []),

    createDockerFileLine("CMD", app.start.command),
  ];

  return dockerFileContent;
};

export const createDockerFileLine = (
  instruction: DockerFileInstruction,
  content: string | string[]
) => ({ instruction, content });
