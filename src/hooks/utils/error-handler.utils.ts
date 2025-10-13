import { ZodError } from "zod";

/**
 * Formats Zod validation errors into a readable string
 */
export const formatZodError = (error: ZodError): string => {
  return error.issues.map((issue) => issue.message).join(", ");
};

/**
 * Checks if an error is a Zod validation error
 */
export const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};

/**
 * Gets a user-friendly error message from any error type
 */
export const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isZodError(error)) {
    return formatZodError(error);
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallbackMessage;
};

/**
 * Normalizes student count to ensure it's a valid number
 */
export const normalizeStudentCount = (count: unknown): number => {
  const parsed = Number(count);
  return Number.isNaN(parsed) || parsed < 0 ? 0 : Math.floor(parsed);
};
