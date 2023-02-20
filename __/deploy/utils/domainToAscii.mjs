import punycode from "punycode/punycode.js";

export const domainToAscii = (domain) => {
  return punycode.toASCII(domain);
};
