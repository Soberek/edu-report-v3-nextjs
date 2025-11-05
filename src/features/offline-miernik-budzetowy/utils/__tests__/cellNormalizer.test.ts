import { describe, it, expect, vi, beforeEach } from "vitest";
import { normalizeCellValue } from "../cellNormalizer";
import ExcelJS from "exceljs";

describe("cellNormalizer", () => {
  describe("normalizeCellValue", () => {
    it("should return empty string for null/undefined values", () => {
      const mockCell = { value: null, text: "" } as ExcelJS.Cell;
      expect(normalizeCellValue(mockCell)).toBe("");
    });

    it("should return number as-is", () => {
      const mockCell = { value: 42, text: "42" } as ExcelJS.Cell;
      expect(normalizeCellValue(mockCell)).toBe(42);
    });

    it("should return string as-is", () => {
      const mockCell = { value: "test", text: "test" } as ExcelJS.Cell;
      expect(normalizeCellValue(mockCell)).toBe("test");
    });

    it("should convert Date to ISO string", () => {
      const date = new Date("2025-01-01");
      const mockCell = { value: date, text: date.toISOString() } as ExcelJS.Cell;
      expect(normalizeCellValue(mockCell)).toBe(date.toISOString());
    });

    it("should convert boolean true to 'TRUE'", () => {
      const mockCell = { value: true, text: "TRUE" } as ExcelJS.Cell;
      expect(normalizeCellValue(mockCell)).toBe("TRUE");
    });

    it("should convert boolean false to 'FALSE'", () => {
      const mockCell = { value: false, text: "FALSE" } as ExcelJS.Cell;
      expect(normalizeCellValue(mockCell)).toBe("FALSE");
    });

    it("should use cell.text as fallback for complex objects", () => {
      const mockCell = {
        value: { complex: "object" },
        text: "complex-value",
      } as unknown as ExcelJS.Cell;
      expect(normalizeCellValue(mockCell)).toBe("complex-value");
    });

    it("should fallback to String() if cell.text is undefined", () => {
      const mockCell = {
        value: { complex: "object" },
        text: undefined,
      } as unknown as ExcelJS.Cell;
      const result = normalizeCellValue(mockCell);
      expect(typeof result).toBe("string");
      expect(result).toContain("object");
    });
  });
});
