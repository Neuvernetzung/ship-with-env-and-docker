import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const write = async (file: string, data: any) => {
  const dirPath = path.dirname(file);

  await mkdir(dirPath, { recursive: true });

  await writeFile(file, data);
};
