import { App, Certbot, Server } from "../../../../types/index.js";
import { DockerFileInstructions as Inst } from "../../../../types/docker.js";
import { stripHttpsFromUrl } from "../../../stripHttpsFromUrl.js";
import {
  createDockerFileLine,
  dockerFileToString,
  getDockerFilePath,
} from "../../index.js";
import { getHelpersPath } from "../getHelpersPath.js";
import { HelperFile } from "../handleHelperFiles.js";

export const CRON_PATH = "cron";

export const CRON_TAB_NAME = "crontab.txt";

export const CRON_SCRIPT_NAME = "renew_certs.sh";

export const createCronFiles = (deploy: Server): HelperFile[] => {
  const cronTab: HelperFile = {
    path: getHelpersPath(`${CRON_PATH}/${CRON_TAB_NAME}`),
    content: `0 0 * * * /${CRON_SCRIPT_NAME} >> /var/log/cron/renew_certs.log`,
  };

  const cronScript: HelperFile = {
    path: getHelpersPath(`${CRON_PATH}/${CRON_SCRIPT_NAME}`),
    content: `
    #!/bin/sh

    cd /workdir
    echo "Let's Encrypt Zertifikate werden erneuert... (\`date\`)"
    certbot renew --no-random-sleep-on-renew
    echo "Nginx Konfiguration erneut laden."
    docker exec nginx nginx -s reload
    echo "Neuladen der Nginx Konfiguration erfolgreich."
    `,
  };

  const cronDockerFile: HelperFile = {
    path: getHelpersPath(getDockerFilePath(CRON_PATH)),
    content: dockerFileToString([
      createDockerFileLine(Inst.FROM, "alpine"),

      createDockerFileLine(
        Inst.RUN,
        "apk update && apk add --no-cache docker-cli certbot"
      ),

      createDockerFileLine(Inst.ADD, `${CRON_TAB_NAME} /${CRON_TAB_NAME}`),

      createDockerFileLine(
        Inst.COPY,
        `${CRON_SCRIPT_NAME} /${CRON_SCRIPT_NAME}`
      ),

      createDockerFileLine(Inst.RUN, `chmod +x /${CRON_SCRIPT_NAME}`),

      createDockerFileLine(Inst.RUN, `sed -i 's/\\r//' /${CRON_SCRIPT_NAME}`), // Fix line ending bugs

      createDockerFileLine(Inst.RUN, `/usr/bin/crontab /${CRON_TAB_NAME}`),

      createDockerFileLine(Inst.WORKDIR, `/workdir`),

      createDockerFileLine(Inst.CMD, ["crond", "-f", "-l", "8"]),
    ]),
  };

  return [cronTab, cronScript, cronDockerFile];
};
