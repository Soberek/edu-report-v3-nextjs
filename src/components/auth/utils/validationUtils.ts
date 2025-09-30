import { z } from "zod";
import { SHARED_AUTH_CONSTANTS, EMAIL_REGEX } from "../constants";

/**
 * Base Zod schema for authentication forms
 */
export const baseAuthFormSchema = z.object({
  email: z
    .string()
    .min(1, SHARED_AUTH_CONSTANTS.VALIDATION.EMAIL_REQUIRED)
    .regex(EMAIL_REGEX, SHARED_AUTH_CONSTANTS.VALIDATION.EMAIL_INVALID),
  password: z
    .string()
    .min(1, SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_REQUIRED)
    .min(SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH, SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH_MESSAGE),
});

/**
 * Type-safe base form data
 */
export type BaseAuthFormData = z.infer<typeof baseAuthFormSchema>;

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
  return password.length >= SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH;
};

/**
 * Generic form validation function
 */
export const validateAuthForm = <T>(
  data: T,
  schema: z.ZodSchema<T>
): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  try {
    schema.parse(data);
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
