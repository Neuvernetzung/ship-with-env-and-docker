export const useCertificatesFunctionName = (name: string) =>
  `use_lets_encrypt_${name}_certificates`;

export const waitForLetsEncryptFunctionName = (name: string) =>
  `wait_for_lets_${name}_encrypt`;
