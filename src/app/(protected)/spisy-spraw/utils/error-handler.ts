import { z } from "zod";
import type { SpisySprawAction } from "../types";
import { actions } from "../reducers/spisySprawReducer";

/**
 * Handles validation errors and dispatches appropriate snackbar messages
 *
 * For Zod validation errors, extracts detailed error information.
 * For other errors, shows a default error message.
 *
 * @param error - The error to handle (unknown type for safety)
 * @param dispatch - Dispatch function for state actions
 * @param defaultMessage - Fallback error message
 */
export const handleValidationError = (error: unknown, dispatch: React.Dispatch<SpisySprawAction>, defaultMessage: string): void => {
  if (error instanceof z.ZodError) {
    const validationMessage = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");

    dispatch(
      actions.showSnackbar({
        type: "error",
        message: `Validation failed: ${validationMessage}`,
      })
    );
  } else {
    dispatch(
      actions.showSnackbar({
        type: "error",
        message: defaultMessage,
      })
    );
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
