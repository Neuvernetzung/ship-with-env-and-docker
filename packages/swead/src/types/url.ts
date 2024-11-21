import { z } from "zod";
import punycode from "punycode/punycode.js";

export const zUrl = z
  .string()
  .transform((url) => {
    const newUrl = url.replace(/^https?:\/\//, "");

    // URL als String erhalten
    let transformedUrl = punycode.toASCII(newUrl);

    // Originalprotokoll wieder hinzufügen
    if (url.startsWith("https://")) {
      transformedUrl = "https://" + transformedUrl;
    } else if (url.startsWith("http://")) {
      transformedUrl = "http://" + transformedUrl;
    }

    return transformedUrl;
  }) // Umwandeln zu ASCII; notwendig für Let's Encrypt etc.
  .pipe(z.string().url());
