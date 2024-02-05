export const stripHttpsFromUrl = (url: string): string =>
  url.replace(/https?:\/\//i, "");
