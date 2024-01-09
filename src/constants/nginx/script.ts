export const useCertificatesFunctionName = (url: string) =>
  `use_lets_encrypt_${url.replaceAll(".", "_")}_certificates`;

export const waitForLetsEncryptFunctionName = (name: string) =>
  `wait_for_lets_${name}_encrypt`;
