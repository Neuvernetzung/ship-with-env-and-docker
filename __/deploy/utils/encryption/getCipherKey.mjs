import crypto from "crypto";

export const getCipherKey = (password) => {
  return crypto.createHash("sha256").update(password).digest();
};
