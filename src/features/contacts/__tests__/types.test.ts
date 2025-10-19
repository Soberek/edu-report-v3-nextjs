/**
 * Tests for types and schemas
 * Tests Zod validation schemas and TypeScript type inference
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  ContactSchema,
  ContactCreateSchema,
  type Contact,
  type ContactFormData,
} from "../types";

describe("Contact Types and Schemas", () => {
  describe("ContactCreateSchema", () => {
    it("should validate valid contact data", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
      };

      const result = ContactCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should require firstName", () => {
      const invalidData = {
        lastName: "Doe",
        email: "john@example.com",
      };

      const result = ContactCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should require lastName", () => {
      const invalidData = {
        firstName: "John",
        email: "john@example.com",
      };

      const result = ContactCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should allow empty email and phone", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        email: "",
        phone: "",
      };

      const result = ContactCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from firstName and lastName", () => {
      const dataWithWhitespace = {
        firstName: "  John  ",
        lastName: "  Doe  ",
      };

      const result = ContactCreateSchema.safeParse(dataWithWhitespace);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("John");
        expect(result.data.lastName).toBe("Doe");
      }
    });

    it("should validate email format", () => {
      const invalidEmailData = {
        firstName: "John",
        lastName: "Doe",
        email: "not-an-email",
      };

      const result = ContactCreateSchema.safeParse(invalidEmailData);
      expect(result.success).toBe(false);
    });

    it("should reject empty firstName and lastName", () => {
      const emptyData = {
        firstName: "",
        lastName: "",
      };

      const result = ContactCreateSchema.safeParse(emptyData);
      expect(result.success).toBe(false);
    });
  });

  describe("ContactSchema", () => {
    it("should validate complete contact record", () => {
      const completeContact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
        userId: "user123",
        createdAt: new Date().toISOString(),
      };

      const result = ContactSchema.safeParse(completeContact);
      expect(result.success).toBe(true);
    });

    it("should require id field", () => {
      const missingId = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
        userId: "user123",
        createdAt: new Date().toISOString(),
      };

      const result = ContactSchema.safeParse(missingId);
      expect(result.success).toBe(false);
    });

    it("should require userId field", () => {
      const missingUserId = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
        createdAt: new Date().toISOString(),
      };

      const result = ContactSchema.safeParse(missingUserId);
      expect(result.success).toBe(false);
    });

    it("should require createdAt field", () => {
      const missingCreatedAt = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
        userId: "user123",
      };

      const result = ContactSchema.safeParse(missingCreatedAt);
      expect(result.success).toBe(false);
    });

    it("should allow optional updatedAt field", () => {
      const contactWithUpdatedAt = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
        userId: "user123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = ContactSchema.safeParse(contactWithUpdatedAt);
      expect(result.success).toBe(true);
    });
  });

  describe("Type inference", () => {
    it("should correctly infer Contact type", () => {
      const contact: Contact = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
        userId: "user123",
        createdAt: new Date().toISOString(),
      };

      expect(contact.id).toBeDefined();
      expect(contact.firstName).toBeDefined();
      expect(contact.userId).toBeDefined();
    });

    it("should correctly infer ContactFormData type", () => {
      const formData: ContactFormData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123456789",
      };

      expect(formData.firstName).toBeDefined();
      expect(formData.lastName).toBeDefined();
      // @ts-expect-error - id should not be in form data
      const _shouldFail = formData.id;
    });
  });

  describe("error messages", () => {
    it("should provide helpful error messages", () => {
      const invalidData = {
        firstName: "",
        lastName: "Doe",
        email: "john@example.com",
      };

      const result = ContactCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].message).toContain("Imię");
      }
    });
  });
});
