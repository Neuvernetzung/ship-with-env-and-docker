import { ZodFormattedError } from "zod";

export const formatZodErrors = (
  errors: ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
      return undefined;
    })
    .filter(Boolean);
