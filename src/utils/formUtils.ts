import { z } from "zod";

/**
 * Create a strongly-typed Zod form schema from field definitions
 * @template T The form data type
 * @param fields Record mapping field names to Zod schemas
 * @returns Zod schema for the form type T
 * @example
 * const schema = createFormSchema<User>({
 *   name: z.string().min(1),
 *   email: z.string().email(),
 * });
 */
export const createFormSchema = <T extends Record<string, unknown>>(fields: Record<keyof T, z.ZodTypeAny>): z.ZodSchema<T> => {
  return z.object(fields) as z.ZodSchema<T>;
};

/**
 * Create a form schema where all fields are optional
 * @template T The form data type
 * @param fields Record mapping field names to Zod schemas
 * @returns Zod schema for partial type T (all fields optional)
 * @example
 * const schema = createOptionalFormSchema<User>({
 *   name: z.string(),
 *   email: z.string(),
 * }); // All fields become optional
 */
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

/**
 * Extract default values from a Zod schema based on field types
 * Supports: string, number, boolean, array, optional, and default values
 * @template T The form data type
 * @param schema The Zod schema to extract defaults from
 * @returns Object with default values for each field (empty string for strings, 0 for numbers, false for booleans, etc.)
 * @example
 * const schema = z.object({ name: z.string(), age: z.number() });
 * const defaults = getFormDefaultValues(schema);
 * // { name: "", age: 0 }
 */
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

/**
 * Validate form data against a Zod schema and collect errors
 * Gracefully handles Zod validation errors, returning structured error messages
 * @template T The form data type
 * @param data The form data to validate (can be partial)
 * @param schema The Zod schema to validate against
 * @returns Object with isValid flag and errors record (keyed by field path for nested fields)
 * @example
 * const schema = z.object({ email: z.string().email() });
 * const result = validateFormData({ email: "invalid" }, schema);
 * // { isValid: false, errors: { email: "Invalid email" } }
 */
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
