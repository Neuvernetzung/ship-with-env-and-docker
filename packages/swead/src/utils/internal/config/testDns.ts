import { bold, logger } from "../index.js";
import { resolve4, resolveCaa, lookup } from "dns/promises";
import { Server } from "../../../types/server.js";
import { performSingleOrMultiple } from "../performSingleOrMultiple.js";
import { stripHttpsFromUrl } from "../../stripHttpsFromUrl.js";
import { ServerDeploy } from "../../../types/deploys.js";
import { getAppDomains } from "./domain.js";

export const testDns = async (server: Server, deploy: ServerDeploy) => {
  const ip = deploy.server.ip;

  await lookup(ip).catch((error) => {
    logger.error(error);
    throw new Error(`The IP address '${ip}' is not reachable.`);
  });

  await performSingleOrMultiple(server.apps, async (app) => {
    if (!app.requireUrl) return;

    const domains = getAppDomains(app, deploy);

    if (!domains?.url)
      throw new Error(
        `Please define a ${bold("domain")} for the app with the name ${bold(
          app.name
        )} in the deploy ${bold(deploy.name)}.`
      );

    await testDomainDns(domains.url, ip);

    if (domains.redirects) {
      await Promise.all(
        domains.redirects.map((redirect) => testDomainDns(redirect, ip, true))
      );
    }
  });
};

export const testDomainDns = async (
  url: string,
  ip: string,
  isRedirect?: boolean
) => {
  const errors = [];
  const domain = stripHttpsFromUrl(url);

  const name = isRedirect ? "REDIRECT" : "DOMAIN";

  const aResult = await resolve4(domain).catch((error) => {
    errors.push(error);
    errors.push(
      `The ${name} (${domain}) is not accessible. Please create a DOMAIN record of type 'A' with the hostname '${
        domain.split(".").length <= 2 ? "@" : domain.split(".")[0]
      }' pointing to the IP address: '${ip}'.`
    );
  });
  if (aResult && !aResult?.includes(ip)) {
    errors.push(
      `The ${name} '${domain}' points to a different IP address. Please make sure that the DOMAIN points to the IP '${ip}'.`
    );
  }

  const caaResult = await resolveCaa(domain).catch((error) => {
    errors.push(error);
    errors.push(
      `The ${name} CERTIFICATION (${domain}) is not accessible. Please create a DOMAIN record of type 'CAA' with the hostname '${
        domain.split(".").length <= 2 ? "@" : domain.split(".")[0]
      }' pointing to the value: 'letsencrypt.org'.`
    );
  });
  if (
    caaResult &&
    ![...caaResult]?.map((i) => i.issue).includes("letsencrypt.org")
  ) {
    errors.push(
      `The ${name} CERTIFICATION (${domain}) points to another certification authority. Please make sure that the certification points to the value 'letsencrypt.org'.`
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
