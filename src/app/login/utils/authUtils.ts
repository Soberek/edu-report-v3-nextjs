import { FirebaseError } from "firebase/app";
import { LOGIN_CONSTANTS } from "../constants";
import type { AuthError } from "../types";

/**
 * Maps Firebase auth error codes to user-friendly messages
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "Nie znaleziono użytkownika z tym adresem email",
  "auth/wrong-password": "Nieprawidłowe hasło",
  "auth/invalid-email": "Nieprawidłowy adres email",
  "auth/user-disabled": "To konto zostało zablokowane",
  "auth/too-many-requests": "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później",
  "auth/network-request-failed": "Błąd połączenia sieciowego",
  "auth/invalid-credential": "Nieprawidłowe dane logowania",
  "auth/user-token-expired": "Sesja wygasła. Zaloguj się ponownie",
  "auth/requires-recent-login": "Wymagane ponowne logowanie",
};

/**
 * Converts Firebase error to user-friendly message
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] || `${LOGIN_CONSTANTS.TEXT.ERROR_PREFIX} ${error.message}`;
  }

  if (error instanceof Error) {
    return `${LOGIN_CONSTANTS.TEXT.ERROR_PREFIX} ${error.message}`;
  }

  return LOGIN_CONSTANTS.TEXT.UNKNOWN_ERROR;
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

/**
 * Checks if error requires user action (like re-authentication)
 */
export const requiresUserAction = (error: AuthError): boolean => {
  const userActionCodes = ["auth/requires-recent-login", "auth/user-token-expired"];

  return userActionCodes.includes(error.code);
};

/**
 * Development-only error logging
 */
export const logErrorInDevelopment = (error: unknown, context: string): void => {
  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    console.error(`${context}:`, error.message);
  }
};
