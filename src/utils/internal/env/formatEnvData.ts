export const formatEnvData = (data: Record<string, string>) => {
  return Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n\n");
};
