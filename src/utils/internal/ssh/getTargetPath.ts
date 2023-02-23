const DEFAULT_TARGET_PATH = "var/www/html";

export const getTargetPath = (path?: string) => path || DEFAULT_TARGET_PATH;
