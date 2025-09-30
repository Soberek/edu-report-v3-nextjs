import { describe, it, expect, beforeEach, vi } from "vitest";
import { FirebaseError } from "firebase/app";
import { getAuthErrorMessage, parseAuthError, isRetryableError, requiresUserAction, logErrorInDevelopment } from "../authUtils";
import { SHARED_AUTH_CONSTANTS } from "../../constants";
import type { AuthError } from "../../types";

describe("authUtils", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", originalEnv);
  });

  describe("getAuthErrorMessage", () => {
    it("should return mapped message for known Firebase error codes", () => {
      const firebaseError = new FirebaseError("auth/user-not-found", "User not found");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Nie znaleziono użytkownika z tym adresem email");
    });

    it("should return mapped message for wrong password error", () => {
      const firebaseError = new FirebaseError("auth/wrong-password", "Wrong password");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Nieprawidłowe hasło");
    });

    it("should return mapped message for email already in use error", () => {
      const firebaseError = new FirebaseError("auth/email-already-in-use", "Email already in use");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Ten adres email jest już używany");
    });

    it("should return mapped message for weak password error", () => {
      const firebaseError = new FirebaseError("auth/weak-password", "Weak password");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Hasło jest zbyt słabe");
    });

    it("should return mapped message for invalid email error", () => {
      const firebaseError = new FirebaseError("auth/invalid-email", "Invalid email");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Nieprawidłowy adres email");
    });

    it("should return mapped message for too many requests error", () => {
      const firebaseError = new FirebaseError("auth/too-many-requests", "Too many requests");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Zbyt wiele nieudanych prób. Spróbuj ponownie później");
    });

    it("should return mapped message for network request failed error", () => {
      const firebaseError = new FirebaseError("auth/network-request-failed", "Network request failed");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Błąd połączenia sieciowego");
    });

    it("should return mapped message for internal error", () => {
      const firebaseError = new FirebaseError("auth/internal-error", "Internal error");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Wystąpił błąd wewnętrzny");
    });

    it("should return mapped message for timeout error", () => {
      const firebaseError = new FirebaseError("auth/timeout", "Timeout");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Przekroczono limit czasu");
    });

    it("should return mapped message for user disabled error", () => {
      const firebaseError = new FirebaseError("auth/user-disabled", "User disabled");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("To konto zostało zablokowane");
    });

    it("should return mapped message for user token expired error", () => {
      const firebaseError = new FirebaseError("auth/user-token-expired", "User token expired");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Sesja wygasła. Zaloguj się ponownie");
    });

    it("should return mapped message for requires recent login error", () => {
      const firebaseError = new FirebaseError("auth/requires-recent-login", "Requires recent login");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Wymagane ponowne logowanie");
    });

    it("should return mapped message for operation not allowed error", () => {
      const firebaseError = new FirebaseError("auth/operation-not-allowed", "Operation not allowed");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Rejestracja jest obecnie wyłączona");
    });

    it("should return mapped message for invalid credential error", () => {
      const firebaseError = new FirebaseError("auth/invalid-credential", "Invalid credential");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe("Nieprawidłowe dane logowania");
    });

    it("should return prefixed message for unknown Firebase error code", () => {
      const firebaseError = new FirebaseError("auth/unknown-error", "Unknown error message");
      const result = getAuthErrorMessage(firebaseError);
      expect(result).toBe(`${SHARED_AUTH_CONSTANTS.TEXT.ERROR_PREFIX} Unknown error message`);
    });

    it("should return prefixed message for regular Error", () => {
      const error = new Error("Regular error message");
      const result = getAuthErrorMessage(error);
      expect(result).toBe(`${SHARED_AUTH_CONSTANTS.TEXT.ERROR_PREFIX} Regular error message`);
    });

    it("should return unknown error message for non-Error objects", () => {
      const result = getAuthErrorMessage("string error");
      expect(result).toBe(SHARED_AUTH_CONSTANTS.TEXT.UNKNOWN_ERROR);
    });

    it("should return unknown error message for null", () => {
      const result = getAuthErrorMessage(null);
      expect(result).toBe(SHARED_AUTH_CONSTANTS.TEXT.UNKNOWN_ERROR);
    });

    it("should return unknown error message for undefined", () => {
      const result = getAuthErrorMessage(undefined);
      expect(result).toBe(SHARED_AUTH_CONSTANTS.TEXT.UNKNOWN_ERROR);
    });
  });

  describe("parseAuthError", () => {
    it("should parse Firebase error correctly", () => {
      const firebaseError = new FirebaseError("auth/user-not-found", "User not found");
      const result = parseAuthError(firebaseError);

      expect(result).toEqual({
        code: "auth/user-not-found",
        message: "Nie znaleziono użytkownika z tym adresem email",
      });
    });

    it("should parse non-Firebase error correctly", () => {
      const error = new Error("Regular error");
      const result = parseAuthError(error);

      expect(result).toEqual({
        code: "unknown",
        message: `${SHARED_AUTH_CONSTANTS.TEXT.ERROR_PREFIX} Regular error`,
      });
    });

    it("should parse unknown error correctly", () => {
      const result = parseAuthError("string error");

      expect(result).toEqual({
        code: "unknown",
        message: SHARED_AUTH_CONSTANTS.TEXT.UNKNOWN_ERROR,
      });
    });
  });

  describe("isRetryableError", () => {
    it("should return true for network request failed error", () => {
      const error: AuthError = {
        code: "auth/network-request-failed",
        message: "Network request failed",
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it("should return true for internal error", () => {
      const error: AuthError = {
        code: "auth/internal-error",
        message: "Internal error",
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it("should return true for timeout error", () => {
      const error: AuthError = {
        code: "auth/timeout",
        message: "Timeout",
      };
      expect(isRetryableError(error)).toBe(true);
    });

    it("should return false for non-retryable errors", () => {
      const error: AuthError = {
        code: "auth/user-not-found",
        message: "User not found",
      };
      expect(isRetryableError(error)).toBe(false);
    });

    it("should return false for unknown error code", () => {
      const error: AuthError = {
        code: "unknown",
        message: "Unknown error",
      };
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe("requiresUserAction", () => {
    it("should return true for requires recent login error", () => {
      const error: AuthError = {
        code: "auth/requires-recent-login",
        message: "Requires recent login",
      };
      expect(requiresUserAction(error)).toBe(true);
    });

    it("should return true for user token expired error", () => {
      const error: AuthError = {
        code: "auth/user-token-expired",
        message: "User token expired",
      };
      expect(requiresUserAction(error)).toBe(true);
    });

    it("should return false for non-user-action errors", () => {
      const error: AuthError = {
        code: "auth/user-not-found",
        message: "User not found",
      };
      expect(requiresUserAction(error)).toBe(false);
    });

    it("should return false for unknown error code", () => {
      const error: AuthError = {
        code: "unknown",
        message: "Unknown error",
      };
      expect(requiresUserAction(error)).toBe(false);
    });
  });

  describe("logErrorInDevelopment", () => {
    it("should log error in development environment", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.stubEnv("NODE_ENV", "development");

      const error = new Error("Test error");
      const context = "test context";

      logErrorInDevelopment(error, context);

      expect(consoleSpy).toHaveBeenCalledWith("test context:", "Test error");

      consoleSpy.mockRestore();
    });

    it("should not log error in production environment", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.stubEnv("NODE_ENV", "production");

      const error = new Error("Test error");
      const context = "test context";

      logErrorInDevelopment(error, context);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should not log non-Error objects", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.stubEnv("NODE_ENV", "development");

      const error = "string error";
      const context = "test context";

      logErrorInDevelopment(error, context);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should not log null or undefined", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.stubEnv("NODE_ENV", "development");

      logErrorInDevelopment(null, "test context");
      logErrorInDevelopment(undefined, "test context");

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
