import { ZodError } from "zod";

export const formatZodError = (error: ZodError): string => error.issues.map((i) => i.message).join(", ");
export const isZodError = (error: unknown): error is ZodError => error instanceof ZodError;
export const getErrorMessage = (error: unknown, fallback: string) => {
  if (isZodError(error)) return formatZodError(error);
  if (error instanceof Error) return error.message;
  return fallback;
};
export const normalizeStudentCount = (count: unknown) => {
  const n = Number(count);
  return Number.isNaN(n) || n < 0 ? 0 : Math.floor(n);
};
