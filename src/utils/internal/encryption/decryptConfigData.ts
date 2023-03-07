import Cryptr from "cryptr";
import { writeFile, readFile, mkdir } from "fs/promises";
import { clean, CONFIG_DEFAULT_NAME, LOCAL_DIR } from "../index.js";
import path from "path";
import { bundleRequire } from "bundle-require";

export const decryptConfigData = async (password: string, encPath: string) => {
  const cryptr = new Cryptr(password);

  const file = await readFile(encPath, "utf8");

  const decryptedString = cryptr.decrypt(file);

  await mkdir(LOCAL_DIR, { recursive: true });

  const configPath = path.join(LOCAL_DIR, CONFIG_DEFAULT_NAME);

  await writeFile(configPath, decryptedString);

  const { mod } = await bundleRequire({
    filepath: configPath,
  });

  await clean(LOCAL_DIR);

  return mod;
};
