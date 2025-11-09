/**
 * Excel Tasks Feature - Test Suite
 *
 * Tests for utilities, hooks, and components
 */

import { describe, it, expect } from "vitest";
import { parseDateToIso, formatDateDisplay } from "../utils/dateUtils";
import { parseViewerCount } from "../utils/numberUtils";

describe("dateUtils", () => {
  describe("parseDateToIso", () => {
    it("parses DD.MM.YYYY format", () => {
      const result = parseDateToIso("08.11.2024");
      expect(result).toBe("2024-11-08");
    });

    it("parses ISO format", () => {
      const result = parseDateToIso("2024-11-08");
      expect(result).toBe("2024-11-08");
    });

    it("handles Excel serial numbers", () => {
      const result = parseDateToIso(45555); // Some Excel date
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("returns today's date for invalid input", () => {
      const result = parseDateToIso("invalid");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("handles null/undefined", () => {
      const result = parseDateToIso(null);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("formatDateDisplay", () => {
    it("formats ISO date to DD.MM.YYYY", () => {
      const result = formatDateDisplay("2024-11-08");
      expect(result).toBe("08.11.2024");
    });

    it("handles invalid input gracefully", () => {
      const result = formatDateDisplay("invalid");
      expect(result).toBe("Invalid date");
    });
  });
});

describe("numberUtils", () => {
  describe("parseViewerCount", () => {
    it("parses number input", () => {
      expect(parseViewerCount(42)).toBe(42);
    });

    it("parses string numbers", () => {
      expect(parseViewerCount("42")).toBe(42);
    });

    it("returns 0 for invalid input", () => {
      expect(parseViewerCount("abc")).toBe(0);
    });

    it("returns 0 for null/undefined", () => {
      expect(parseViewerCount(null)).toBe(0);
      expect(parseViewerCount(undefined)).toBe(0);
    });

    it("handles negative numbers", () => {
      const result = parseViewerCount(-10);
      expect(result).toBe(-10); // Parser returns as-is, schema validates
    });
  });
});
