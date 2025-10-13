import { FirebaseError } from "firebase/app";
import { SHARED_AUTH_CONSTANTS } from "../constants";
import type { AuthError } from "../types";

/**
 * Maps Firebase auth error codes to user-friendly messages
 * Covers both login and registration errors
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Login errors
  "auth/user-not-found": "Nie znaleziono użytkownika z tym adresem email",
  "auth/wrong-password": "Nieprawidłowe hasło",
  "auth/invalid-credential": "Nieprawidłowe dane logowania",
  "auth/user-disabled": "To konto zostało zablokowane",
  "auth/user-token-expired": "Sesja wygasła. Zaloguj się ponownie",
  "auth/requires-recent-login": "Wymagane ponowne logowanie",

  // Registration errors
  "auth/email-already-in-use": "Ten adres email jest już używany",
  "auth/weak-password": "Hasło jest zbyt słabe",
  "auth/operation-not-allowed": "Rejestracja jest obecnie wyłączona",

  // Common errors
  "auth/invalid-email": "Nieprawidłowy adres email",
  "auth/too-many-requests": "Zbyt wiele nieudanych prób. Spróbuj ponownie później",
  "auth/network-request-failed": "Błąd połączenia sieciowego",
  "auth/internal-error": "Wystąpił błąd wewnętrzny",
  "auth/timeout": "Przekroczono limit czasu",
};

/**
 * Converts Firebase error to user-friendly message
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] || 
           `${SHARED_AUTH_CONSTANTS.TEXT.ERROR_PREFIX} ${error.message}`;
  }

  if (error instanceof Error) {
    return `${SHARED_AUTH_CONSTANTS.TEXT.ERROR_PREFIX} ${error.message}`;
  }

  return SHARED_AUTH_CONSTANTS.TEXT.UNKNOWN_ERROR;
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
  const retryableCodes = [
    "auth/network-request-failed",
    "auth/internal-error", 
    "auth/timeout"
  ];

  return retryableCodes.includes(error.code);
};

/**
 * Checks if error requires user action (like re-authentication)
 */
export const requiresUserAction = (error: AuthError): boolean => {
  const userActionCodes = [
    "auth/requires-recent-login",
    "auth/user-token-expired"
  ];

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
