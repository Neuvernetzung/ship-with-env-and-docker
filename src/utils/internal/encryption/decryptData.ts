import Cryptr from "cryptr";

export const decryptData = (password: string, encryptedData: string) => {
  const cryptr = new Cryptr(password);

  const decryptedConfig = cryptr.decrypt(encryptedData);

  return JSON.parse(decryptedConfig);
};
