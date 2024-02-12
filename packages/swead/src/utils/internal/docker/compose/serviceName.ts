import { stripHttpsFromUrl } from "@/index.js";

export const dockerComposeServiceName = (name: string) =>
  name.toLowerCase().replace(" ", "-");

export const dockerComposeRedirectServiceName = (url: string) =>
  `redirect-${dockerComposeServiceName(stripHttpsFromUrl(url))}`;
