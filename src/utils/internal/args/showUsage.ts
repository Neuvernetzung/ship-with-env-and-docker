import { logger } from "../index.js";

const usage = `
Usage: swead {METHOD} {ARGS}

Main-Methods:

 - production - start production deployment
  
 - staging - start staging deployment

 - local - start local server

 - dev - start development server


Helper-Methods:

 - init - initialize new deployment config

 - encrypt - encrypt deployment config

 - decrypt - decrypt deployment config


Arguments:

 -c, --config - custom path to ts or js config file. Default is swead-config.ts

 -s, --skip - skip to the provided deployment-task (number)

 -a, --attached - keep the docker-compose process attached (, to see docker-compose logs for debugging)

 -r, --remove - stop and remove other docker containers before starting the new containers

 -p, --password - password for encrypted config file

 -v, --verbose - show verbose log output

 -h, --help - Show this message`;

export const showUsage = () => {
  logger.default(usage);
};
