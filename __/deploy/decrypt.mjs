import crypto from "crypto";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { coloredConsole, getCipherKey, readInitVect } from "./utils/index.mjs";
import inquirer from "inquirer";

const decrypt = async () => {
  const file = "deployment-config.json";

  if (!fs.existsSync(path.join(file + ".enc")))
    return coloredConsole(
      "red",
      `Die Datei ${path.join(file + ".enc")} existiert nicht.`
    );

  coloredConsole(
    "magenta",
    "Gib das Passwort ein, mit der die Serverdaten entschlüsselt werden sollen."
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

  const initVect = await readInitVect({ file });

  const cipherKey = getCipherKey(password);
  const readStream = fs.createReadStream(path.join(file + ".enc"), {
    start: 16,
  });
  const decipher = crypto.createDecipheriv("aes256", cipherKey, initVect);
  const unzip = zlib.createUnzip();
  const writeStream = fs.createWriteStream(file);

  readStream
    .on("error", (e) => {
      return coloredConsole("red", "Es ist ein Fehler aufgetreten");
    })
    .pipe(decipher)
    .on("error", (e) => {
      return coloredConsole("red", "Es ist ein Fehler aufgetreten");
    })
    .pipe(unzip)
    .on("error", (e) => {
      return coloredConsole("red", "Es ist ein Fehler aufgetreten");
    })
    .pipe(writeStream)
    .on("error", (e) => {
      return coloredConsole("red", "Es ist ein Fehler aufgetreten");
    });

  await new Promise((resolve) => writeStream.on("finish", resolve));

  fs.unlinkSync(path.join(file + ".enc"));

  coloredConsole(
    "magenta",
    "Die Serverdaten wurden entschlüsselt und können nun bearbeitet werden."
  );
};

decrypt();
