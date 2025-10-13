import { z } from "zod";
import { baseAuthFormSchema, validateAuthForm, BaseAuthFormData } from "@/features/auth";

/**
 * Registration form schema extends the base auth form schema
 */
export const registerFormSchema = baseAuthFormSchema;

/**
 * Type-safe form data derived from schema
 */
export type RegisterFormData = BaseAuthFormData;

/**
 * Validates the registration form data using shared validation
 */
export const validateRegisterForm = (data: RegisterFormData): { 
  isValid: boolean; 
  errors: Record<string, string> 
} => {
  return validateAuthForm(data, registerFormSchema);
};

// Re-export shared validation utilities
export { isValidEmail, isValidPassword } from "@/features/auth";
