import isArray from "lodash/isArray.js";

export const commandWithWaitOn = (
  command: string,
  waitOn?: string | string[]
) => {
  if (waitOn) {
    const formattedWaitOn = isArray(waitOn)
      ? waitOn.map((w) => withTcpOnDev(w)).join(" ")
      : withTcpOnDev(waitOn);
    return `npx wait-on -l ${formattedWaitOn} && ${command}`;
  }
  return command;
};

export const withTcpOnDev = (waitOn: string) => {
  // nötig, da Localhost sonst versucht auf nicht vorhandene Ipv6 Adresse zuzugreifen.
  if (waitOn.includes("localhost"))
    return `tcp:${waitOn.replace("http://", "").replace("https://", "")}`;
  return waitOn;
};
