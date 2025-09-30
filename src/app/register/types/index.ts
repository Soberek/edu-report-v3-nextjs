/**
 * Types and interfaces for the registration module
 */

// RegisterFormData is exported from utils/validationUtils.ts

export interface RegisterFormErrors {
  readonly email?: string;
  readonly password?: string;
  readonly general?: string;
}

export interface AuthError {
  readonly code: string;
  readonly message: string;
}

export interface RegisterPageProps {
  readonly redirectTo?: string;
}

export interface UseRegisterResult {
  readonly register: (data: import("../utils/validationUtils").RegisterFormData) => Promise<void>;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly clearError: () => void;
}

export interface UseAuthRedirectResult {
  readonly shouldRedirect: boolean;
  readonly redirectPath: string;
}
