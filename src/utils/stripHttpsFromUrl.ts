export const stripHttpsFromUrl = (url: string) =>
  url.replace(/https?:\/\//i, "");
