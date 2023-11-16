import {
  createDockerFileLine,
  dockerFileToString,
  getDockerFilePath,
} from "../../index";
import { getHelpersPath } from "../getHelpersPath";
import { HelperFile } from "../handleHelperFiles";

export const CRON_PATH = "cron";

export const CRON_TAB_NAME = "crontab.txt";

export const CRON_SCRIPT_NAME = "renew_certs.sh";

export const createCronFiles = (): HelperFile[] => {
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
      createDockerFileLine("FROM", "alpine"),

      createDockerFileLine(
        "RUN",
        "apk update && apk add --no-cache docker-cli certbot"
      ),

      createDockerFileLine("ADD", `${CRON_TAB_NAME} /${CRON_TAB_NAME}`),

      createDockerFileLine("COPY", `${CRON_SCRIPT_NAME} /${CRON_SCRIPT_NAME}`),

      createDockerFileLine("RUN", `chmod +x /${CRON_SCRIPT_NAME}`),

      createDockerFileLine("RUN", `sed -i 's/\\r//' /${CRON_SCRIPT_NAME}`), // Fix line ending bugs

      createDockerFileLine("RUN", `/usr/bin/crontab /${CRON_TAB_NAME}`),

      createDockerFileLine("WORKDIR", `/workdir`),

      createDockerFileLine("CMD", ["crond", "-f", "-l", "8"]),
    ]),
  };

  return [cronTab, cronScript, cronDockerFile];
};
