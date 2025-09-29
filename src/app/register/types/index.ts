/**
 * Types and interfaces for the registration module
 */

export interface RegisterFormData {
  readonly email: string;
  readonly password: string;
}

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
  readonly register: (data: RegisterFormData) => Promise<void>;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly clearError: () => void;
}

export interface UseAuthRedirectResult {
  readonly shouldRedirect: boolean;
  readonly redirectPath: string;
}
