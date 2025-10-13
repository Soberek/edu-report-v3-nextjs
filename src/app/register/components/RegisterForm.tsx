import React from "react";
import { AuthForm } from "@/features/auth";
import { registerFormSchema } from "../utils";
import { REGISTER_CONSTANTS } from "../constants";
import type { RegisterFormData } from "../utils";

interface RegisterFormProps {
  readonly onSubmit: (data: RegisterFormData) => Promise<void>;
  readonly isLoading: boolean;
  readonly disabled?: boolean;
}

/**
 * Registration form component using shared AuthForm
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, disabled = false }) => {
  return (
    <AuthForm
      onSubmit={onSubmit}
      isLoading={isLoading}
      disabled={disabled}
      schema={registerFormSchema}
      constants={REGISTER_CONSTANTS}
      submitButtonText={REGISTER_CONSTANTS.TEXT.SUBMIT_BUTTON}
      loadingText={REGISTER_CONSTANTS.TEXT.SUBMIT_LOADING}
    />
  );
};
