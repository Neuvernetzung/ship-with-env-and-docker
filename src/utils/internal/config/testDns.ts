import { bold, logger } from "../index.js";
import dnsPromises from "dns/promises";
import { App, Server } from "../../../types/server.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { stripHttpsFromUrl } from "../../stripHttpsFromUrl.js";
import { ServerDeploy } from "../../../types/deploys.js";

export const getAppDomain = (app: App, deploy: ServerDeploy) => {
  const domain = deploy.use.domains.find(
    (domain) => domain.app === app.name
  )?.url;

  return domain;
};

export const testDns = async (server: Server, deploy: ServerDeploy) => {
  const ip = deploy.server.ip;

  await dnsPromises.lookup(ip).catch((error) => {
    logger.error(error);
    throw new Error(`The IP address '${ip}' is not reachable.`);
  });

  await performSingleOrMultiple(server.apps, async (app) => {
    if (!app.requireUrl) return;

    const domain = getAppDomain(app, deploy);

    if (!domain)
      throw new Error(
        `Please define a ${bold("domain")} for the app with the name ${bold(
          app.name
        )} in the deploy ${bold(deploy.name)}.`
      );

    await testDomainDns(domain, ip);
  });
};

export const testDomainDns = async (url: string, ip: string) => {
  const errors = [];
  const domain = stripHttpsFromUrl(url);

  const aResult = await dnsPromises.resolve4(domain).catch((error) => {
    errors.push(error);
    errors.push(
      `The DOMAIN (${domain}) is not accessible. Please create a DOMAIN record of type 'A' with the hostname '${
        domain.split(".").length <= 2 ? "@" : domain.split(".")[0]
      }' pointing to the IP address: '${ip}'.`
    );
  });
  if (aResult && !aResult?.includes(ip)) {
    errors.push(
      `The DOMAIN '${domain}' points to a different IP address. Please make sure that the DOMAIN points to the IP '${ip}'.`
    );
  }

  const wwwResult = await dnsPromises
    .resolve4("www." + domain)
    .catch((error) => {
      errors.push(error);
      errors.push(
        `The DOMAIN (www.${domain}) is not accessible. Please create a DOMAIN record of type 'A' with the hostname '${
          domain.split(".").length <= 2 ? "www" : "www." + domain.split(".")[0]
        }' pointing to the IP: '${ip}'`
      );
    });
  if (wwwResult && !wwwResult?.includes(ip)) {
    errors.push(
      `The redirect 'www.${domain}' points to a different IP address. Please make sure that the redirect points to the DOMAIN '${domain}'.`
    );
  }

  const caaResult = await dnsPromises.resolveCaa(domain).catch((error) => {
    errors.push(error);
    errors.push(
      `The DOMAIN CERTIFICATION (${domain}) is not accessible. Please create a DOMAIN record of type 'CAA' with the hostname '${
        domain.split(".").length <= 2 ? "@" : domain.split(".")[0]
      }' pointing to the value: 'letsencrypt.org'.`
    );
  });
  if (
    caaResult &&
    ![...caaResult]?.map((i) => i.issue).includes("letsencrypt.org")
  ) {
    errors.push(
      `The DOMAIN CERTIFICATION (${domain}) points to another certification authority. Please make sure that the certification points to the value 'letsencrypt.org'.`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `${errors.join(
        "\n"
      )}\n\nPlease fix these errors in your dns configurations.`
    );
  }
};
