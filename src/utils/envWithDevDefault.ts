import { z } from "zod";
import type { TypeOf } from "zod";

export const envWithDevDefault = <T extends z.ZodTypeAny>(
  schema: T,
  val: TypeOf<T>
) => (process.env.NODE_ENV !== "production" ? schema.default(val) : schema);
