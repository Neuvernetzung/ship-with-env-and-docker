import { NodeSSH, SSHExecCommandOptions } from "node-ssh";
import { logger } from "../logger.js";
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

export const execCommand = async (
  ssh: NodeSSH,
  command: string,
  options?: SSHExecCommandOptions
) => {
  await ssh.execCommand(command, merge(execOptions, options));
};
