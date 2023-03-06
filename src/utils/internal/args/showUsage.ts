import { logger } from "../index.js";

const usage = `
Usage: swead {METHOD} {OPTIONS}

Methods:

 - production
 
  start production deployment
  
 - staging

  start staging deployment

 - local

  start local server

 - dev

  start development server


Standard Options:

 -c, --config

  custom path to ts or js config file. Default is swead-config.ts

 -h, --help

  Show this message`;

export const showUsage = () => {
  logger.default(usage);
};
