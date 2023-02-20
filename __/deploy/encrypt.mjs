import crypto from "crypto";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import {
  coloredConsole,
  AppendInitVect,
  getCipherKey,
} from "./utils/index.mjs";
import inquirer from "inquirer";

const encrypt = async () => {
  const file = "deployment-config.json";

  if (!fs.existsSync(file))
    return coloredConsole("red", `Die Datei ${file} existiert nicht.`);

  coloredConsole(
    "magenta",
    "Gib das Passwort ein, mit der die Serverdaten verschlüsselt werden sollen."
  );
  const { password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      mask: "*",
      message:
        "Gib das Passwort ein, mit der die Serverdaten entschlüsselt werden sollen.",
    },
  ]);
  const { password: cf_password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      mask: "*",
      message: "Bestätige bitte das Passwort.",
    },
  ]);
  if (password !== cf_password) {
    return coloredConsole(
      "red",
      `Die beiden Passwörter stimmen nicht überein.`
    );
  }

  const initVect = crypto.randomBytes(16);

  // Generate a cipher key from the password.
  const CIPHER_KEY = getCipherKey(password);
  const readStream = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv("aes256", CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);

  const writeStream = fs.createWriteStream(path.join(file + ".enc"));

  readStream.pipe(gzip).pipe(cipher).pipe(appendInitVect).pipe(writeStream);

  await new Promise((resolve) => writeStream.on("finish", resolve));

  fs.unlinkSync(file);

  coloredConsole(
    "magenta",
    "Die Serverdaten wurden erfolgreich verschlüsselt."
  );
};

encrypt();
