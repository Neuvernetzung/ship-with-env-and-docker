import open from "open";
import waitOn from "wait-on";
import { withTcpOnDev } from "./commandWithWaitOn.js";

export const openInBrowser = async (url: string) => {
  await waitOn({ resources: [withTcpOnDev(url)] });
  open(url);
};
