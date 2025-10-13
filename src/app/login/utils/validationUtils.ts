import { z } from "zod";
import { baseAuthFormSchema, validateAuthForm, BaseAuthFormData } from "@/features/auth";

/**
 * Login form schema extends the base auth form schema
 */
export const loginFormSchema = baseAuthFormSchema;

/**
 * Type-safe form data derived from schema
 */
export type LoginFormData = BaseAuthFormData;

/**
 * Validates the login form data using shared validation
 */
export const validateLoginForm = (
  data: LoginFormData
): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  return validateAuthForm(data, loginFormSchema);
};

// Re-export shared validation utilities
export { isValidEmail, isValidPassword } from "@/features/auth";
