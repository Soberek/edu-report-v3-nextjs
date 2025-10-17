import { renderHook, act } from "@testing-library/react";
import { z } from "zod";
import { useFormValidation, ValidationResult } from "../useFormValidation";

describe("useFormValidation", () => {
  // Basic schema for testing
  const basicSchema = z.object({
    email: z.string().email("Invalid email"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.number().min(0, "Age must be non-negative"),
  });

  type BasicFormData = z.infer<typeof basicSchema>;

  describe("validate method", () => {
    it("should return valid result for correct data", () => {
      const { result } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      const data = { email: "test@example.com", name: "John", age: 30 };
      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate(data);
      });

      expect(validationResult!.isValid).toBe(true);
      expect(validationResult!.errors).toEqual({});
    });

    it("should return invalid result with error messages for incorrect data", () => {
      const { result } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      const data = { email: "invalid-email", name: "A", age: -5 };
      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate(data);
      });

      expect(validationResult!.isValid).toBe(false);
      expect(validationResult!.errors).toHaveProperty("email");
      expect(validationResult!.errors).toHaveProperty("name");
      expect(validationResult!.errors).toHaveProperty("age");
    });

    it("should handle partial data", () => {
      const { result } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      const partialData = { email: "test@example.com" };
      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate(partialData as BasicFormData);
      });

      // Partial data should fail because schema requires all fields
      expect(validationResult!.isValid).toBe(false);
    });

    it("should handle partial schema with optional fields", () => {
      const partialSchema = z.object({
        email: z.string().email("Invalid email"),
        nickname: z.string().optional(),
      });

      type PartialFormData = z.infer<typeof partialSchema>;

      const { result } = renderHook(() => useFormValidation<PartialFormData>(partialSchema));

      const data: PartialFormData = { email: "test@example.com" };
      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate(data);
      });

      expect(validationResult!.isValid).toBe(true);
      expect(validationResult!.errors).toEqual({});
    });

    it("should return general error message for non-Zod errors", () => {
      // Create a mock schema that throws a non-Zod error
      const mockSchema = { 
        parse: () => { 
          throw new Error("Unknown error"); 
        } 
      } as unknown as z.ZodSchema<BasicFormData>;

      const { result } = renderHook(() => useFormValidation<BasicFormData>(mockSchema));

      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate({} as BasicFormData);
      });

      expect(validationResult!.isValid).toBe(false);
      expect(validationResult!.errors.general).toBeDefined();
    });
  });

  describe("validateField method", () => {
    it("should return null for valid field value", () => {
      const { result } = renderHook(() => useFormValidation(basicSchema));

      let error;

      act(() => {
        error = result.current.validateField("email", "test@example.com");
      });

      expect(error).toBeNull();
    });

    it("should return error message for invalid field value", () => {
      const { result } = renderHook(() => useFormValidation(basicSchema));

      let error;

      act(() => {
        error = result.current.validateField("email", "invalid-email");
      });

      expect(error).not.toBeNull();
      expect(error).toContain("Invalid email");
    });

    it("should validate name field with minimum length", () => {
      const { result } = renderHook(() => useFormValidation(basicSchema));

      let error;

      act(() => {
        error = result.current.validateField("name", "A");
      });

      expect(error).not.toBeNull();
      expect(error).toContain("at least 2 characters");
    });

    it("should validate age field with non-negative constraint", () => {
      const { result } = renderHook(() => useFormValidation(basicSchema));

      let error;

      act(() => {
        error = result.current.validateField("age", -5);
      });

      expect(error).not.toBeNull();
      expect(error).toContain("non-negative");
    });

    it("should handle non-existent field gracefully", () => {
      const { result } = renderHook(() => useFormValidation(basicSchema));

      let error;

      act(() => {
        error = result.current.validateField("nonExistent" as never, "value");
      });

      // Should return null for non-existent field
      expect(error).toBeNull();
    });

    it("should handle type mismatches gracefully", () => {
      const { result } = renderHook(() => useFormValidation(basicSchema));

      let error;

      act(() => {
        error = result.current.validateField("age", "not a number");
      });

      // Should return an error for type mismatch
      expect(error).not.toBeNull();
    });

    it("should return specific error message for each field", () => {
      const customSchema = z.object({
        username: z.string().min(3, "Username too short"),
        password: z.string().min(8, "Password too short"),
      });

      const { result } = renderHook(() => useFormValidation(customSchema));

      let usernameError, passwordError;

      act(() => {
        usernameError = result.current.validateField("username", "ab");
        passwordError = result.current.validateField("password", "short");
      });

      expect(usernameError).toContain("Username too short");
      expect(passwordError).toContain("Password too short");
    });
  });

  describe("validateFields method", () => {
    it("should validate multiple fields at once", () => {
      const { result } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      let fieldsResult: Record<string, string | null> | undefined;

      act(() => {
        fieldsResult = result.current.validateFields({
          email: "test@example.com",
          name: "John",
          age: 30,
        });
      });

      expect(fieldsResult!.email).toBeNull();
      expect(fieldsResult!.name).toBeNull();
      expect(fieldsResult!.age).toBeNull();
    });

    it("should return errors for invalid fields", () => {
      const { result } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      let fieldsResult: Record<string, string | null> | undefined;

      act(() => {
        fieldsResult = result.current.validateFields({
          email: "invalid-email",
          name: "A",
          age: -5,
        });
      });

      expect(fieldsResult!.email).not.toBeNull();
      expect(fieldsResult!.name).not.toBeNull();
      expect(fieldsResult!.age).not.toBeNull();
    });

    it("should handle mixed valid and invalid fields", () => {
      const { result } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      let fieldsResult: Record<string, string | null> | undefined;

      act(() => {
        fieldsResult = result.current.validateFields({
          email: "test@example.com",
          name: "A",
          age: 30,
        });
      });

      expect(fieldsResult!.email).toBeNull();
      expect(fieldsResult!.name).not.toBeNull();
      expect(fieldsResult!.age).toBeNull();
    });

    it("should handle empty fields object", () => {
      const { result } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      let fieldsResult: Record<string, string | null> | undefined;

      act(() => {
        fieldsResult = result.current.validateFields({});
      });

      expect(fieldsResult).toEqual({});
    });

    it("should handle partial field validation", () => {
      const { result } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      let fieldsResult: Record<string, string | null> | undefined;

      act(() => {
        fieldsResult = result.current.validateFields({
          email: "test@example.com",
          name: "John",
        });
      });

      expect(fieldsResult!.email).toBeNull();
      expect(fieldsResult!.name).toBeNull();
      expect(fieldsResult!.age).toBeUndefined();
    });
  });

  describe("memoization", () => {
    it("should return same object reference for multiple calls", () => {
      const { result, rerender } = renderHook(() => useFormValidation<BasicFormData>(basicSchema));

      const firstCall = result.current;

      rerender();

      const secondCall = result.current;

      expect(firstCall).toBe(secondCall);
    });

    it("should update object reference when schema changes", () => {
      type Schema1 = { name: string };
      type CombinedSchema = Schema1 & { email?: string };

      const schema1 = z.object({ name: z.string() }) as unknown as z.ZodSchema<CombinedSchema>;
      const schema2 = z.object({ 
        name: z.string(), 
        email: z.string().optional() 
      }) as z.ZodSchema<CombinedSchema>;

      const { result, rerender } = renderHook(
        ({ schema }: { schema: z.ZodSchema<CombinedSchema> }) => 
          useFormValidation<CombinedSchema>(schema),
        {
          initialProps: { schema: schema1 },
        }
      );

      const firstCall = result.current;

      rerender({ schema: schema2 });

      const secondCall = result.current;

      expect(firstCall).not.toBe(secondCall);
    });
  });

  describe("edge cases", () => {
    it("should handle nested object validation", () => {
      type NestedFormData = {
        user: {
          email: string;
          name: string;
        };
      };

      const nestedSchema = z.object({
        user: z.object({
          email: z.string().email(),
          name: z.string(),
        }),
      }) as z.ZodSchema<NestedFormData>;

      const { result } = renderHook(() => useFormValidation<NestedFormData>(nestedSchema));

      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate({
          user: { email: "test@example.com", name: "John" },
        });
      });

      expect(validationResult!.isValid).toBe(true);
    });

    it("should handle array validation", () => {
      type ArrayFormData = {
        tags: string[];
      };

      const arraySchema = z.object({
        tags: z.array(z.string()).min(1, "At least one tag required"),
      }) as z.ZodSchema<ArrayFormData>;

      const { result } = renderHook(() => useFormValidation<ArrayFormData>(arraySchema));

      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate({ tags: [] });
      });

      expect(validationResult!.isValid).toBe(false);
      expect(validationResult!.errors.tags).toBeDefined();
    });

    it("should handle enum validation", () => {
      type EnumFormData = {
        status: "active" | "inactive" | "pending";
      };

      const enumSchema = z.object({
        status: z.enum(["active", "inactive", "pending"]),
      }) as z.ZodSchema<EnumFormData>;

      const { result } = renderHook(() => useFormValidation<EnumFormData>(enumSchema));

      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate({ status: "active" });
      });

      expect(validationResult!.isValid).toBe(true);
    });

    it("should handle union type validation", () => {
      type UnionFormData = {
        id: string | number;
      };

      const unionSchema = z.object({
        id: z.union([z.string(), z.number()]),
      }) as z.ZodSchema<UnionFormData>;

      const { result } = renderHook(() => useFormValidation<UnionFormData>(unionSchema));

      let validationResult1: ValidationResult | undefined;
      let validationResult2: ValidationResult | undefined;

      act(() => {
        validationResult1 = result.current.validate({ id: "string-id" });
        validationResult2 = result.current.validate({ id: 123 });
      });

      expect(validationResult1!.isValid).toBe(true);
      expect(validationResult2!.isValid).toBe(true);
    });

    it("should handle coercion in schemas", () => {
      type CoercionFormData = {
        age: number;
      };

      const coercionSchema = z.object({
        age: z.coerce.number(),
      }) as z.ZodSchema<CoercionFormData>;

      const { result } = renderHook(() => useFormValidation<CoercionFormData>(coercionSchema));

      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate({ age: 30 } as CoercionFormData);
      });

      expect(validationResult!.isValid).toBe(true);
    });

    it("should handle optional fields correctly", () => {
      type OptionalFormData = {
        email?: string;
        name: string;
      };

      const optionalSchema = z.object({
        email: z.string().email().optional(),
        name: z.string(),
      }) as z.ZodSchema<OptionalFormData>;

      const { result } = renderHook(() => useFormValidation<OptionalFormData>(optionalSchema));

      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate({ name: "John" });
      });

      expect(validationResult!.isValid).toBe(true);
    });

    it("should handle nullable fields correctly", () => {
      type NullableFormData = {
        middleName: string | null;
        name: string;
      };

      const nullableSchema = z.object({
        middleName: z.string().nullable(),
        name: z.string(),
      }) as z.ZodSchema<NullableFormData>;

      const { result } = renderHook(() => useFormValidation<NullableFormData>(nullableSchema));

      let validationResult: ValidationResult | undefined;

      act(() => {
        validationResult = result.current.validate({ name: "John", middleName: null });
      });

      expect(validationResult!.isValid).toBe(true);
    });
  });
});
