import { describe, it, expect } from "vitest";
import { z } from "zod";
import { baseAuthFormSchema, isValidEmail, isValidPassword, validateAuthForm } from "../validationUtils";
import { SHARED_AUTH_CONSTANTS, EMAIL_REGEX } from "../../constants";
import type { BaseAuthFormData } from "../validationUtils";

describe("validationUtils", () => {
  describe("baseAuthFormSchema", () => {
    it("should validate correct email and password", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = baseAuthFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty email", () => {
      const invalidData = {
        email: "",
        password: "password123",
      };

      const result = baseAuthFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(SHARED_AUTH_CONSTANTS.VALIDATION.EMAIL_REQUIRED);
      }
    });

    it("should reject invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };

      const result = baseAuthFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(SHARED_AUTH_CONSTANTS.VALIDATION.EMAIL_INVALID);
      }
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = baseAuthFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_REQUIRED);
      }
    });

    it("should reject password shorter than minimum length", () => {
      const invalidData = {
        email: "test@example.com",
        password: "12345",
      };

      const result = baseAuthFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH_MESSAGE);
      }
    });

    it("should accept password with exact minimum length", () => {
      const validData = {
        email: "test@example.com",
        password: "123456",
      };

      const result = baseAuthFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept various valid email formats", () => {
      const validEmails = ["user@example.com", "user.name@example.com", "user+tag@example.co.uk", "user123@example-domain.com"];

      validEmails.forEach((email) => {
        const validData = {
          email,
          password: "password123",
        };

        const result = baseAuthFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it("should reject various invalid email formats", () => {
      const invalidEmails = ["user@", "@example.com", "user.example.com", "user@.com", "user@example", "user name@example.com", ""];

      invalidEmails.forEach((email) => {
        const invalidData = {
          email,
          password: "password123",
        };

        const result = baseAuthFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe("isValidEmail", () => {
    it("should return true for valid email addresses", () => {
      const validEmails = ["test@example.com", "user.name@example.com", "user+tag@example.co.uk", "user123@example-domain.com"];

      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it("should return false for invalid email addresses", () => {
      const invalidEmails = [
        "user@",
        "@example.com",
        "user.example.com",
        "user@.com",
        "user@example",
        "user name@example.com",
        "",
        "invalid",
      ];

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it("should use the same regex as EMAIL_REGEX constant", () => {
      const testEmail = "test@example.com";
      expect(isValidEmail(testEmail)).toBe(EMAIL_REGEX.test(testEmail));
    });
  });

  describe("isValidPassword", () => {
    it("should return true for passwords with minimum length", () => {
      const validPasswords = [
        "123456",
        "password123",
        "verylongpassword",
        "a".repeat(SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH),
      ];

      validPasswords.forEach((password) => {
        expect(isValidPassword(password)).toBe(true);
      });
    });

    it("should return false for passwords shorter than minimum length", () => {
      const invalidPasswords = ["", "12345", "short", "a".repeat(SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH - 1)];

      invalidPasswords.forEach((password) => {
        expect(isValidPassword(password)).toBe(false);
      });
    });

    it("should use the same minimum length as constant", () => {
      const minLength = SHARED_AUTH_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH;
      expect(isValidPassword("a".repeat(minLength))).toBe(true);
      expect(isValidPassword("a".repeat(minLength - 1))).toBe(false);
    });
  });

  describe("validateAuthForm", () => {
    const testSchema = z.object({
      email: z.string().email("Invalid email"),
      password: z.string().min(6, "Password too short"),
      name: z.string().min(1, "Name required"),
    });

    type TestFormData = z.infer<typeof testSchema>;

    it("should return valid result for correct data", () => {
      const validData: TestFormData = {
        email: "test@example.com",
        password: "password123",
        name: "John Doe",
      };

      const result = validateAuthForm(validData, testSchema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should return invalid result with field errors", () => {
      const invalidData = {
        email: "invalid-email",
        password: "123",
        name: "",
      };

      const result = validateAuthForm(invalidData as TestFormData, testSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual({
        email: "Invalid email",
        password: "Password too short",
        name: "Name required",
      });
    });

    it("should handle nested field paths", () => {
      const nestedSchema = z.object({
        user: z.object({
          email: z.string().email("Invalid email"),
        }),
      });

      type NestedFormData = z.infer<typeof nestedSchema>;

      const invalidData: NestedFormData = {
        user: {
          email: "invalid-email",
        },
      };

      const result = validateAuthForm(invalidData, nestedSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual({
        user: "Invalid email",
      });
    });

    it("should handle non-ZodError exceptions", () => {
      const throwingSchema = z.object({
        email: z.string().refine(() => {
          throw new Error("Custom error");
        }),
      });

      const data = {
        email: "test@example.com",
      };

      const result = validateAuthForm(data, throwingSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual({
        general: "Validation error",
      });
    });

    it("should work with baseAuthFormSchema", () => {
      const validData: BaseAuthFormData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = validateAuthForm(validData, baseAuthFormSchema);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should return errors for invalid baseAuthFormSchema data", () => {
      const invalidData = {
        email: "invalid-email",
        password: "123",
      };

      const result = validateAuthForm(invalidData as BaseAuthFormData, baseAuthFormSchema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("email");
      expect(result.errors).toHaveProperty("password");
    });
  });
});
