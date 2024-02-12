import path from "path";
import slash from "slash";

export const join = (...paths: string[]) => slash(path.join(...paths));
