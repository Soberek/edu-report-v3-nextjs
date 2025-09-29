import { FirebaseError } from "firebase/app";
import { REGISTER_CONSTANTS } from "../constants";
import type { AuthError } from "../types";

/**
 * Maps Firebase auth error codes to user-friendly messages
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "Ten adres email jest już używany",
  "auth/invalid-email": "Nieprawidłowy adres email",
  "auth/operation-not-allowed": "Rejestracja jest obecnie wyłączona",
  "auth/weak-password": "Hasło jest zbyt słabe",
  "auth/network-request-failed": "Błąd połączenia sieciowego",
  "auth/too-many-requests": "Zbyt wiele prób. Spróbuj ponownie później",
};

/**
 * Converts Firebase error to user-friendly message
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] || `${REGISTER_CONSTANTS.TEXT.ERROR_PREFIX} ${error.message}`;
  }

  if (error instanceof Error) {
    return `${REGISTER_CONSTANTS.TEXT.ERROR_PREFIX} ${error.message}`;
  }

  return REGISTER_CONSTANTS.TEXT.UNKNOWN_ERROR;
};

/**
 * Extracts structured error information from Firebase error
 */
export const parseAuthError = (error: unknown): AuthError => {
  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: getAuthErrorMessage(error),
    };
  }

  return {
    code: "unknown",
    message: getAuthErrorMessage(error),
  };
};

/**
 * Checks if error is retryable
 */
export const isRetryableError = (error: AuthError): boolean => {
  const retryableCodes = ["auth/network-request-failed", "auth/internal-error", "auth/timeout"];

  return retryableCodes.includes(error.code);
};
