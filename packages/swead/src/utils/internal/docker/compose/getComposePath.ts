import { join } from "../../index.js";

export const COMPOSE_FILE_NAME = "docker-compose.yml";

export const getComposePath = (dir: string) => join(dir, COMPOSE_FILE_NAME);
