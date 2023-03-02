import { ZodIssue } from "zod";
import { generateErrorMessage, ErrorMessageOptions } from "zod-error";

const errorMessageOptions: ErrorMessageOptions = {
  delimiter: { error: "\n " },
  transform: ({ errorMessage, index }) =>
    `\tError #${index + 1}: ${errorMessage}`,
};

export const formatZodErrors = (errors: ZodIssue[]) =>
  generateErrorMessage(errors, errorMessageOptions);
