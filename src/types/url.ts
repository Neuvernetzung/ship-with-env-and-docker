import { z } from "zod";
import punycode from "punycode";

export const zUrl = z
  .string()
  .transform((url) => {
    let newUrl = url.replace(/^https?:\/\//, "");

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
