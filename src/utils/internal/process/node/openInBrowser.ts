// import open from "open"; verursacht: Error: Dynamic require of "path" is not supported
import waitOn from "wait-on";
import { withTcpOnDev, runNodeProcess } from "./index";

export const openInBrowser = async (url: string) => {
  await waitOn({ resources: [withTcpOnDev(url)] });
  await runNodeProcess(
    `npx -y open-cli ${url.includes("http://") ? url : `http://${url}`}`
  ); // Stattdessen CLI Version davon nutzen
  // open(url);
};
