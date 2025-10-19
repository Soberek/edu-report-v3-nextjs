/**
 * Tests for validation utility functions
 * Tests validation helpers and error formatting
 */

import { describe, it, expect } from "vitest";
import { isValidEmail, normalizePhoneNumber } from "../utils/validation";

describe("Validation Utilities", () => {
  describe("isValidEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(isValidEmail("john@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
      expect(isValidEmail("test+tag@example.com")).toBe(true);
    });

    it("should return false for invalid email addresses", () => {
      expect(isValidEmail("invalid@")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("no-at-sign")).toBe(false);
      expect(isValidEmail("spaces in@email.com")).toBe(false);
    });

    it("should return true for empty string (email is optional)", () => {
      expect(isValidEmail("")).toBe(true);
    });
  });

  describe("normalizePhoneNumber", () => {
    it("should remove non-digit characters except spaces and hyphens", () => {
      expect(normalizePhoneNumber("123-456-789")).toBe("123-456-789");
      expect(normalizePhoneNumber("123 456 789")).toBe("123 456 789");
      expect(normalizePhoneNumber("(123) 456-789")).toBe("(123) 456-789");
    });

    it("should remove special characters", () => {
      expect(normalizePhoneNumber("123@456#789")).toBe("123456789");
      expect(normalizePhoneNumber("+48-123-456")).toBe("48-123-456");
    });

    it("should trim whitespace", () => {
      expect(normalizePhoneNumber("  123456789  ")).toBe("123456789");
    });

    it("should return empty string for empty input", () => {
      expect(normalizePhoneNumber("")).toBe("");
    });

    it("should handle mixed formats", () => {
      expect(normalizePhoneNumber("(+48) 123-456-789")).toBe("(48) 123-456-789");
    });
  });
});
