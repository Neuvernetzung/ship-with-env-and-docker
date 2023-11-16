import type { App, ServerDeploy, UrlUnion } from "@/types";
import { createDefaultConf } from "./config";
import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl";

const baseConfig: App = { docker: {}, name: "Test" as const };
const baseDeploy = (url: UrlUnion): ServerDeploy => ({
  name: "Test",
  envs: [],
  server: { ip: "unknown", ssh: { user: "unknown", password: "unknown" } },
  use: { domains: [{ app: "Test", url }], key: "Test" },
});

it("Test single domain server config", () => {
  const url = "http://test.de";

  const serverConfig = createDefaultConf(baseConfig, baseDeploy(url));

  expect(serverConfig).toContain(`server_name ${stripHttpsFromUrl(url)}`);
});

it("Test multiple domain server config", () => {
  const url = ["http://test.de", "https://www.test.de"];

  const serverConfig = createDefaultConf(baseConfig, baseDeploy(url));

  url.forEach((u) =>
    expect(serverConfig).toContain(`server_name ${stripHttpsFromUrl(u)}`)
  );
});
