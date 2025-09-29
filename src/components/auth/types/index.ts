/**
 * Shared types and interfaces for authentication modules
 */

export interface BaseAuthFormData {
  readonly email: string;
  readonly password: string;
}

export interface AuthError {
  readonly code: string;
  readonly message: string;
}

export interface AuthPageProps {
  readonly redirectTo?: string;
}

export interface UseAuthRedirectResult {
  readonly shouldRedirect: boolean;
  readonly redirectPath: string;
}

export interface UseAuthFormResult<T extends BaseAuthFormData> {
  readonly submit: (data: T) => Promise<void>;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly clearError: () => void;
}

export interface ErrorAlertProps {
  readonly error: string | null;
  readonly onClose?: () => void;
  readonly title?: string;
}

export interface AuthFormProps<T extends BaseAuthFormData> {
  readonly onSubmit: (data: T) => Promise<void>;
  readonly isLoading: boolean;
  readonly disabled?: boolean;
  readonly schema: any; // Zod schema
  readonly constants: any; // Constants object
  readonly submitButtonText: string;
  readonly loadingText: string;
}

export interface AuthLayoutProps {
  readonly title: string;
  readonly backgroundGradient: string;
  readonly paperElevation: number;
  readonly borderRadius: number;
  readonly minWidth: number;
  readonly maxWidth: number;
  readonly children: React.ReactNode;
}
