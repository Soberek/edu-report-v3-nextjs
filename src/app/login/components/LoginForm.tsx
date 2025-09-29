import React from "react";
import { AuthForm } from "@/components/auth";
import { loginFormSchema } from "../utils";
import { LOGIN_CONSTANTS } from "../constants";
import type { LoginFormData } from "../utils";

interface LoginFormProps {
  readonly onSubmit: (data: LoginFormData) => Promise<void>;
  readonly isLoading: boolean;
  readonly disabled?: boolean;
}

/**
 * Login form component using shared AuthForm
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, disabled = false }) => {
  return (
    <AuthForm
      onSubmit={onSubmit}
      isLoading={isLoading}
      disabled={disabled}
      schema={loginFormSchema}
      constants={LOGIN_CONSTANTS}
      submitButtonText={LOGIN_CONSTANTS.TEXT.SUBMIT_BUTTON}
      loadingText={LOGIN_CONSTANTS.TEXT.SUBMIT_LOADING}
    />
  );
};
