import crypto from "crypto";

export const generateSecretToken = (length) => {
  const token = crypto.randomBytes(length || 48).toString("hex");
  return token;
};
