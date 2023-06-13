import { App, BuildUnion } from "../../../../types/index.js";
import {
  DockerFileContent,
  DockerFileInstructions as Inst,
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
    createDockerFileLine(Inst.FROM, baseImage),

    createDockerFileLine(Inst.RUN, "npm install -g npm@latest"), // npm updaten

    createDockerFileLine(Inst.RUN, "apk add --no-cache libc6-compat"), // libc6-compat hinzufügen um turborepo bugs zu fixen

    createDockerFileLine(Inst.RUN, "apk update && apk add git"), // linux updaten und git installieren

    createDockerFileLine(
      Inst.RUN,
      `mkdir -p ${getWorkdirPath(app.docker?.workDir)}`
    ), // workdir erstellen

    ...(app.docker?.volumes?.map((vol) =>
      createDockerFileLine(Inst.RUN, `mkdir -p ${vol}`)
    ) || []), // Volumes erstellen zur Sicherheit

    createDockerFileLine(Inst.WORKDIR, getWorkdirPath(app.docker?.workDir)), // workdir festlegen

    ...(app.docker.skipInstall
      ? []
      : [
          ...packagePaths.map(
            (p) => createDockerFileLine(Inst.COPY, [p, "./"]) // package.json und package-lock.json kopieren
          ), // createDockerFileLine(Inst.COPY, ["*/package.json", "."]) funktioniert (noch) nicht

          createDockerFileLine(Inst.RUN, "npm i --omit=dev"), // installieren, bis auf dev-Deps
        ]),

    ...(app.docker.copyArtifactOnly
      ? artifactPaths.map((p) => createDockerFileLine(Inst.COPY, [p, "."]))
      : [createDockerFileLine(Inst.COPY, [".", "."])]), // alles weitere kopieren

    ...(app.docker?.port
      ? app.docker?.port.map((port) =>
          createDockerFileLine(Inst.EXPOSE, String(port))
        )
      : []), // ports exposen

    ...(app.docker.beforeStart
      ? app.docker.beforeStart.map((command) =>
          createDockerFileLine(command.instruction, command.content)
        )
      : []),

    createDockerFileLine(Inst.CMD, app.start.command),
  ];

  return dockerFileContent;
};

export const createDockerFileLine = (
  instruction: Inst,
  content: string | string[]
) => ({ instruction, content });
