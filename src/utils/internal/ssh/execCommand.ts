import { NodeSSH, SSHExecCommandOptions } from "node-ssh";
import { logger } from "../index.js";
import merge from "lodash/merge.js";

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
  stdout?: NodeJS.WriteStream & NodeJS.WritableStream;
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
    })
  );
};
