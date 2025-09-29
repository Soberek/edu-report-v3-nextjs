/**
 * Types and interfaces for the login module
 */

export interface LoginFormData {
  readonly email: string;
  readonly password: string;
}

export interface LoginFormErrors {
  readonly email?: string;
  readonly password?: string;
  readonly general?: string;
}

export interface AuthError {
  readonly code: string;
  readonly message: string;
}

export interface LoginPageProps {
  readonly redirectTo?: string;
}

export interface UseLoginResult {
  readonly login: (data: LoginFormData) => Promise<void>;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly clearError: () => void;
}

export interface UseAuthRedirectResult {
  readonly shouldRedirect: boolean;
  readonly redirectPath: string;
}
