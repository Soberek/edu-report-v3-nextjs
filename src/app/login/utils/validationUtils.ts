import { z } from "zod";
import { LOGIN_CONSTANTS, EMAIL_REGEX } from "../constants";

/**
 * Zod schema for login form validation
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, LOGIN_CONSTANTS.VALIDATION.EMAIL_REQUIRED)
    .regex(EMAIL_REGEX, LOGIN_CONSTANTS.VALIDATION.EMAIL_INVALID),
  password: z
    .string()
    .min(1, LOGIN_CONSTANTS.VALIDATION.PASSWORD_REQUIRED)
    .min(
      LOGIN_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH,
      LOGIN_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH_MESSAGE
    ),
});

/**
 * Type-safe form data derived from schema
 */
export type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= LOGIN_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH;
};

/**
 * Validates the entire form data
 */
export const validateLoginForm = (data: LoginFormData): { 
  isValid: boolean; 
  errors: Record<string, string> 
} => {
  try {
    loginFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.reduce((acc: Record<string, string>, err) => {
        const field = err.path[0] as string;
        acc[field] = err.message;
        return acc;
      }, {});
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Validation error" } };
  }
};
