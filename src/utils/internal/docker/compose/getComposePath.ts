import path from "path";

export const COMPOSE_FILE_NAME = "docker-compose.yml";

export const getComposePath = (dir: string) =>
  path.join(dir, COMPOSE_FILE_NAME);
