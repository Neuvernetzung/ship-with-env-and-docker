import open from "open";
import waitOn from "wait-on";

export const openInBrowser = async (url: string) => {
  await waitOn({ resources: [url] });
  open(url);
};
