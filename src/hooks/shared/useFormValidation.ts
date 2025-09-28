import { useCallback } from "react";
import { z } from "zod";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const useFormValidation = <T extends Record<string, any>>(schema: z.ZodSchema<T>) => {
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

  const validateField = useCallback(
    (fieldName: keyof T, value: any): string | null => {
      try {
        const fieldSchema = schema.shape[fieldName as string];
        if (fieldSchema) {
          fieldSchema.parse(value);
          return null;
        }
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.issues[0]?.message || "Nieprawidłowa wartość";
        }
        return "Nieprawidłowa wartość";
      }
    },
    [schema]
  );

  return {
    validate,
    validateField,
  };
};
