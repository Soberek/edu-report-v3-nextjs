import { z } from "zod";

export const createFormSchema = <T extends Record<string, unknown>>(fields: Record<keyof T, z.ZodTypeAny>): z.ZodSchema<T> => {
  return z.object(fields) as z.ZodSchema<T>;
};

export const createOptionalFormSchema = <T extends Record<string, unknown>>(
  fields: Record<keyof T, z.ZodTypeAny>
): z.ZodSchema<Partial<T>> => {
  const optionalFields = Object.entries(fields).reduce(
    (acc, [key, schema]) => ({
      ...acc,
      [key]: schema.optional(),
    }),
    {} as Record<keyof T, z.ZodOptional<z.ZodTypeAny>>
  );
  return z.object(optionalFields) as z.ZodSchema<Partial<T>>;
};

export const getFormDefaultValues = <T extends Record<string, unknown>>(schema: z.ZodSchema<T>): Partial<T> => {
  const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;
  const defaults: Partial<T> = {};

  Object.entries(shape).forEach(([key, fieldSchema]) => {
    if (fieldSchema instanceof z.ZodDefault) {
      defaults[key as keyof T] = (fieldSchema._def.defaultValue as () => T[keyof T])();
    } else if (fieldSchema instanceof z.ZodOptional) {
      defaults[key as keyof T] = undefined;
    } else if (fieldSchema instanceof z.ZodString) {
      defaults[key as keyof T] = "" as T[keyof T];
    } else if (fieldSchema instanceof z.ZodNumber) {
      defaults[key as keyof T] = 0 as T[keyof T];
    } else if (fieldSchema instanceof z.ZodBoolean) {
      defaults[key as keyof T] = false as T[keyof T];
    } else if (fieldSchema instanceof z.ZodArray) {
      defaults[key as keyof T] = [] as T[keyof T];
    }
  });

  return defaults;
};

export const validateFormData = <T extends Record<string, unknown>>(
  data: Partial<T>,
  schema: z.ZodSchema<T>
): { isValid: boolean; errors: Record<string, string> } => {
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
};
