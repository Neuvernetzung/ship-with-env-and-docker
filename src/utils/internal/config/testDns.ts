import { logger } from "../index.js";
import dnsPromises from "dns/promises";
import { Server } from "../../../types/server.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { stripHttpsFromUrl } from "../../stripHttpsFromUrl.js";

export const testDns = async (deploy: Server) => {
  let hasErrors = false;

  const ip = deploy.server.ip;

  await dnsPromises.lookup(ip).catch((error) => {
    logger.error(error);
    logger.error(`The IP address '${ip}' is not reachable.`);
    hasErrors = true;
  });

  await performSingleOrMultiple(deploy.apps, async (app) => {
    if (!app.url) return;
    const domain = stripHttpsFromUrl(app.url);

    const aResult = await dnsPromises.resolve4(domain).catch((error) => {
      logger.error(error);
      logger.error(
        `The DOMAIN (${domain}) is not accessible. Please create a DOMAIN record of type 'A' with the hostname '${
          domain.split(".").length <= 2 ? "@" : domain.split(".")[0]
        }' pointing to the IP address: '${ip}'.`
      );
      hasErrors = true;
    });
    if (aResult && !aResult?.includes(ip)) {
      logger.error(
        `The DOMAIN '${domain}' points to a different IP address. Please make sure that the DOMAIN points to the IP '${ip}'.`
      );

      hasErrors = true;
    }

    const wwwResult = await dnsPromises
      .resolve4("www." + domain)
      .catch((error) => {
        logger.error(error);
        logger.error(
          `The DOMAIN (www.${domain}) is not accessible. Please create a DOMAIN record of type 'A' with the hostname '${
            domain.split(".").length <= 2
              ? "www"
              : "www." + domain.split(".")[0]
          }' pointing to the DOMAIN: '${domain}'`
        );

        hasErrors = true;
      });
    if (wwwResult && !wwwResult?.includes(ip)) {
      logger.error(
        `The redirect (www.${domain}) points to another DOMAIN. Please make sure that the redirect points to the DOMAIN '${domain}'.`
      );
      hasErrors = true;
    }

    const caaResult = await dnsPromises.resolveCaa(domain).catch((error) => {
      logger.error(error);
      logger.error(
        `The DOMAIN CERTIFICATION (${domain}) is not accessible. Please create a DOMAIN record of type 'CAA' with the hostname '${
          domain.split(".").length <= 2 ? "@" : domain.split(".")[0]
        }' pointing to the value: 'letsencrypt.org'.`
      );
      hasErrors = true;
    });
    if (
      caaResult &&
      ![...caaResult]?.map((i) => i.issue).includes("letsencrypt.org")
    ) {
      logger.error(
        `The DOMAIN CERTIFICATION (${domain}) points to another certification authority. Please make sure that the certification points to the value 'letsencrypt.org'.`
      );
      hasErrors = true;
    }
  });

  if (hasErrors) {
    throw new Error("Please fix these errors in your dns configurations.");
  }
};
