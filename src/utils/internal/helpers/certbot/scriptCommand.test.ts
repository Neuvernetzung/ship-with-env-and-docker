import { stripHttpsFromUrl } from "@/utils/stripHttpsFromUrl";
import { createCertbotScriptCommand } from "./scriptCommand";

it("Test single Url Script generation", () => {
  const url = "http://test.de";

  const script = createCertbotScriptCommand(url);

  expect(script).toContain(`-d "${stripHttpsFromUrl(url)}"`);
});
