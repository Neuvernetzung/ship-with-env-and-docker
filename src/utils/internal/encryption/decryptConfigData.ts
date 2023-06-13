import Cryptr from "cryptr";

export const decryptConfigData = (password: string, encryptedData: string) => {
  const cryptr = new Cryptr(password);

  const decryptedConfig = cryptr.decrypt(encryptedData);

  return JSON.parse(decryptedConfig);
};
