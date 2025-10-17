import { describe, it, expect } from "vitest";
import {
  VALIDATION_PATTERNS,
  testPattern,
  validateEmail,
  validatePhone,
  validatePolishPhone,
  validatePostalCode,
  validateUrl,
  validateIsoDate,
  validateTime,
  validateUrlSlug,
  validateStrongPassword,
  validateUuid,
  validateFilename,
} from "../patterns";

describe("VALIDATION_PATTERNS", () => {
  describe("email pattern", () => {
    it("accepts valid email addresses", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("test.user+tag@subdomain.co.uk")).toBe(true);
      expect(validateEmail("a@b.c")).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      expect(validateEmail("notanemail")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user@.com")).toBe(false);
    });
  });

  describe("phone pattern", () => {
    it("accepts valid international phone numbers", () => {
      expect(validatePhone("+48123456789")).toBe(true);
      expect(validatePhone("48123456789")).toBe(true);
      expect(validatePhone("+1234567890")).toBe(true);
    });

    it("rejects invalid phone numbers", () => {
      expect(validatePhone("+0123456789")).toBe(false);
      expect(validatePhone("123")).toBe(false);
      expect(validatePhone("+48 0 123456789")).toBe(false);
    });

    it("removes spaces from phone numbers", () => {
      expect(validatePhone("+48 123 456 789")).toBe(true);
      expect(validatePhone("48 123 456 789")).toBe(true);
    });
  });

  describe("Polish phone pattern", () => {
    it("accepts valid Polish phone numbers", () => {
      expect(validatePolishPhone("+48123456789")).toBe(true);
      expect(validatePolishPhone("0123456789")).toBe(true);
    });

    it("rejects invalid Polish phone numbers", () => {
      expect(validatePolishPhone("+49123456789")).toBe(false);
      expect(validatePolishPhone("00123456789")).toBe(false);
      expect(validatePolishPhone("+48 0 123456789")).toBe(false);
    });
  });

  describe("postal code pattern", () => {
    it("accepts valid Polish postal codes", () => {
      expect(validatePostalCode("00-001")).toBe(true);
      expect(validatePostalCode("31-999")).toBe(true);
      expect(validatePostalCode("80-000")).toBe(true);
    });

    it("rejects invalid postal codes", () => {
      expect(validatePostalCode("00001")).toBe(false);
      expect(validatePostalCode("00-1")).toBe(false);
      expect(validatePostalCode("00-00")).toBe(false);
      expect(validatePostalCode("00-00-00")).toBe(false);
    });
  });

  describe("URL pattern", () => {
    it("accepts valid URLs", () => {
      expect(validateUrl("http://example.com")).toBe(true);
      expect(validateUrl("https://example.com/path")).toBe(true);
      expect(validateUrl("https://sub.example.co.uk")).toBe(true);
    });

    it("rejects invalid URLs", () => {
      expect(validateUrl("ftp://example.com")).toBe(false);
      expect(validateUrl("example.com")).toBe(false);
      expect(validateUrl("//example.com")).toBe(false);
    });
  });

  describe("ISO date pattern", () => {
    it("accepts valid ISO dates", () => {
      expect(validateIsoDate("2024-01-15")).toBe(true);
      expect(validateIsoDate("2024-12-31")).toBe(true);
      expect(validateIsoDate("2000-02-29")).toBe(true); // Leap year
    });

    it("rejects invalid ISO dates", () => {
      expect(validateIsoDate("2024-13-01")).toBe(false);
      expect(validateIsoDate("2024-01-32")).toBe(false);
      expect(validateIsoDate("2023-02-29")).toBe(false); // Not a leap year
      expect(validateIsoDate("24-01-15")).toBe(false);
      expect(validateIsoDate("2024/01/15")).toBe(false);
    });
  });

  describe("time pattern", () => {
    it("accepts valid time formats", () => {
      expect(validateTime("12:30")).toBe(true);
      expect(validateTime("23:59")).toBe(true);
      expect(validateTime("00:00")).toBe(true);
      expect(validateTime("12:30:45")).toBe(true);
    });

    it("rejects invalid time formats", () => {
      expect(validateTime("24:00")).toBe(false);
      expect(validateTime("12:60")).toBe(false);
      expect(validateTime("12:30:60")).toBe(false);
      expect(validateTime("1:30")).toBe(false);
    });
  });

  describe("URL slug pattern", () => {
    it("accepts valid URL slugs", () => {
      expect(validateUrlSlug("my-page")).toBe(true);
      expect(validateUrlSlug("blog-post-title")).toBe(true);
      expect(validateUrlSlug("page123")).toBe(true);
    });

    it("rejects invalid URL slugs", () => {
      expect(validateUrlSlug("My-Page")).toBe(false);
      expect(validateUrlSlug("my_page")).toBe(false);
      expect(validateUrlSlug("my page")).toBe(false);
      expect(validateUrlSlug("-my-page")).toBe(false);
    });
  });

  describe("strong password pattern", () => {
    it("accepts strong passwords", () => {
      expect(validateStrongPassword("Password123")).toBe(true);
      expect(validateStrongPassword("MySecureP@ss123")).toBe(true);
      expect(validateStrongPassword("ABCDefgh1")).toBe(true);
    });

    it("rejects weak passwords", () => {
      expect(validateStrongPassword("password")).toBe(false); // No uppercase or number
      expect(validateStrongPassword("PASSWORD123")).toBe(false); // No lowercase
      expect(validateStrongPassword("Password")).toBe(false); // No number
      expect(validateStrongPassword("Pass1")).toBe(false); // Too short
    });
  });

  describe("UUID pattern", () => {
    it("accepts valid UUIDs v4", () => {
      expect(
        validateUuid("550e8400-e29b-41d4-a716-446655440000")
      ).toBe(true);
      expect(
        validateUuid("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
      ).toBe(true);
    });

    it("rejects invalid UUIDs", () => {
      expect(validateUuid("550e8400-e29b-41d4-a716")).toBe(false);
      expect(validateUuid("550e8400-e29b-41d4-a716-446655440000-extra")).toBe(
        false
      );
      expect(validateUuid("not-a-uuid")).toBe(false);
    });
  });

  describe("filename pattern", () => {
    it("accepts valid filenames", () => {
      expect(validateFilename("document.pdf")).toBe(true);
      expect(validateFilename("my-file.xlsx")).toBe(true);
      expect(validateFilename("file name.docx")).toBe(true);
    });

    it("rejects invalid filenames", () => {
      expect(validateFilename("file")).toBe(false);
      expect(validateFilename("file..pdf")).toBe(false);
      expect(validateFilename(".pdf")).toBe(false);
    });
  });

  describe("testPattern utility", () => {
    it("tests values against patterns", () => {
      expect(testPattern("test@example.com", VALIDATION_PATTERNS.email)).toBe(
        true
      );
      expect(testPattern("not-email", VALIDATION_PATTERNS.email)).toBe(false);
    });
  });
});
