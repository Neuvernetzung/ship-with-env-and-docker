import { NodeSSH, SSHExecCommandOptions } from "node-ssh";
import { logger } from "../index";
import merge from "lodash/merge";

const execOptions: SSHExecCommandOptions = {
  cwd: "/",
  onStdout(chunk) {
    logger.default(chunk.toString("utf8"));
  },
  onStderr(chunk) {
    logger.error(chunk.toString("utf8"));
  },
};

type SSHExecCommandCustomOptions = {
  cwd?: string;
  stdout?: NodeJS.WritableStream;
};

export const execCommand = async (
  ssh: NodeSSH,
  command: string,
  options?: SSHExecCommandCustomOptions
) => {
  await ssh.execCommand(
    command,
    merge(execOptions, {
      cwd: options?.cwd,
      onStdout: options?.stdout?.write || undefined,
      onStderr: options?.stdout?.write || undefined,
    })
  );
};
