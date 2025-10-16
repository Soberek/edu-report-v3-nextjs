import { useCallback, useMemo } from "react";
import { z } from "zod";

/**
 * Result of form validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Hook for form validation using Zod schemas
 * Provides methods to validate entire forms and individual fields
 *
 * @template T The type of form data being validated
 * @param schema Zod schema for validation
 * @returns Object with validate and validateField methods
 *
 * @example
 * const { validate, validateField } = useFormValidation(mySchema);
 * const result = validate(formData);
 * const fieldError = validateField('email', emailValue);
 */
export const useFormValidation = <T extends Record<string, unknown>>(schema: z.ZodSchema<T>) => {
  /**
   * Validates entire form data against the schema
   * @param data Partial form data to validate
   * @returns ValidationResult with isValid flag and errors object
   */
  const validate = useCallback(
    (data: Partial<T>): ValidationResult => {
      try {
        schema.parse(data);
        return { isValid: true, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.issues.forEach((issue) => {
            const path = issue.path.join(".");
            errors[path] = issue.message;
          });
          return { isValid: false, errors };
        }
        return { isValid: false, errors: { general: "Wystąpił błąd walidacji" } };
      }
    },
    [schema]
  );

  /**
   * Validates a single field
   * @param fieldName The field name to validate
   * @param value The value to validate
   * @returns Error message if invalid, null if valid
   */
  const validateField = useCallback(
    (fieldName: keyof T, value: unknown): string | null => {
      try {
        const fieldSchema = (schema as z.ZodObject<z.ZodRawShape>).shape[fieldName as string];

        // Fallback if field schema is not found
        if (!fieldSchema) {
          console.warn(
            `Field "${String(fieldName)}" not found in schema. Skipping validation.`
          );
          return null;
        }

        // Check if the field schema has a parse method
        if (!("parse" in fieldSchema)) {
          console.warn(
            `Field "${String(fieldName)}" schema does not support parsing. Skipping validation.`
          );
          return null;
        }

        (fieldSchema as z.ZodType).parse(value);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.issues[0]?.message || "Nieprawidłowa wartość";
        }
        // Handle non-Zod errors gracefully
        if (error instanceof Error) {
          return error.message;
        }
        return "Nieprawidłowa wartość";
      }
    },
    [schema]
  );

  /**
   * Validates multiple fields at once
   * @param fields Object with field names as keys and values to validate
   * @returns Object with field names as keys and error messages (or null) as values
   */
  const validateFields = useCallback(
    (fields: Partial<Record<keyof T, unknown>>): Record<string, string | null> => {
      const result: Record<string, string | null> = {};

      Object.entries(fields).forEach(([fieldName, value]) => {
        result[fieldName] = validateField(fieldName as keyof T, value);
      });

      return result;
    },
    [validateField]
  );

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      validate,
      validateField,
      validateFields,
    }),
    [validate, validateField, validateFields]
  );
};
