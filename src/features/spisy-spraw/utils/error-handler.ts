import { z } from "zod";

/**
 * Handles validation errors and dispatches appropriate snackbar messages
 *
 * For Zod validation errors, extracts detailed error information.
 * For other errors, shows a default error message.
 *
 * @param error - The error to handle (unknown type for safety)
 * @param showError - Notification handler for error messages
 * @param defaultMessage - Fallback error message
 */
export const handleValidationError = (error: unknown, showError: (message: string) => void, defaultMessage: string): void => {
  if (error instanceof z.ZodError) {
    const validationMessage = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");

    showError(`Validation failed: ${validationMessage}`);
  } else {
    showError(defaultMessage);
  }
};

/**
 * Formats error messages for display
 * Handles both single errors and arrays of errors
 *
 * @param error - Error or array of errors
 * @returns Array of error message strings
 */
export const formatErrorMessages = (error: unknown): string[] => {
  if (!error) return [];
  if (Array.isArray(error)) return error;
  if (typeof error === "string") return [error];
  if (error instanceof Error) return [error.message];
  return [String(error)];
};
