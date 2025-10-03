import { describe, it, expect } from "vitest";
import { canProcessData, getSelectedMonthsCount, canExportData, shouldAutoProcess, getCurrentError } from "../dataProcessingUtils";
import type { ExcelRow, Month, AggregatedData } from "../../types";

describe("dataProcessingUtils", () => {
  describe("canProcessData", () => {
    const mockRawData: ExcelRow[] = [
      {
        "Typ programu": "Test",
        "Nazwa programu": "Test Program",
        Działanie: "Test Action",
        "Liczba ludzi": 10,
        "Liczba działań": 5,
        Data: "2024-01-01",
      },
    ];

    const mockSelectedMonths: Month[] = [
      { monthNumber: 1, selected: true },
      { monthNumber: 2, selected: false },
    ];

    const mockUnselectedMonths: Month[] = [
      { monthNumber: 1, selected: false },
      { monthNumber: 2, selected: false },
    ];

    it("should return true when all conditions are met", () => {
      const result = canProcessData(mockRawData, mockSelectedMonths, null);
      expect(result).toBe(true);
    });

    it("should return false when rawData is empty", () => {
      const result = canProcessData([], mockSelectedMonths, null);
      expect(result).toBe(false);
    });

    it("should return false when no months are selected", () => {
      const result = canProcessData(mockRawData, mockUnselectedMonths, null);
      expect(result).toBe(false);
    });

    it("should return false when aggregated data already exists", () => {
      const existingData: AggregatedData = {
        aggregated: {},
        allPeople: 10,
        allActions: 5,
      };
      const result = canProcessData(mockRawData, mockSelectedMonths, existingData);
      expect(result).toBe(false);
    });

    it("should handle edge case with empty months array", () => {
      const result = canProcessData(mockRawData, [], null);
      expect(result).toBe(false);
    });

    it("should handle null raw data gracefully", () => {
      // Now the function handles null gracefully and returns false
      const result = canProcessData(null as any, mockSelectedMonths, null);
      expect(result).toBe(false);
    });

    it("should handle undefined parameters", () => {
      // Now the function handles undefined gracefully and returns false
      const result = canProcessData(undefined as any, undefined as any, null);
      expect(result).toBe(false);
    });

    it("should return false when all three conditions fail", () => {
      const existingData: AggregatedData = {
        aggregated: {},
        allPeople: 10,
        allActions: 5,
      };
      const result = canProcessData([], mockUnselectedMonths, existingData);
      expect(result).toBe(false);
    });

    it("should handle very large raw data arrays", () => {
      const largeData = Array.from({ length: 10000 }, () => mockRawData[0]);
      const result = canProcessData(largeData, mockSelectedMonths, null);
      expect(result).toBe(true);
    });
  });

  describe("getSelectedMonthsCount", () => {
    it("should count selected months correctly", () => {
      const months: Month[] = [
        { monthNumber: 1, selected: true },
        { monthNumber: 2, selected: true },
        { monthNumber: 3, selected: false },
        { monthNumber: 4, selected: true },
      ];

      const count = getSelectedMonthsCount(months);
      expect(count).toBe(3);
    });

    it("should return 0 when no months are selected", () => {
      const months: Month[] = [
        { monthNumber: 1, selected: false },
        { monthNumber: 2, selected: false },
      ];

      const count = getSelectedMonthsCount(months);
      expect(count).toBe(0);
    });

    it("should return correct count when all months are selected", () => {
      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: true,
      }));

      const count = getSelectedMonthsCount(months);
      expect(count).toBe(12);
    });

    it("should handle empty array", () => {
      const count = getSelectedMonthsCount([]);
      expect(count).toBe(0);
    });

    it("should handle single selected month", () => {
      const months: Month[] = [{ monthNumber: 1, selected: true }];
      const count = getSelectedMonthsCount(months);
      expect(count).toBe(1);
    });

    it("should handle alternating selection pattern", () => {
      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: i % 2 === 0, // Every other month
      }));

      const count = getSelectedMonthsCount(months);
      expect(count).toBe(6);
    });

    it("should handle null or undefined gracefully", () => {
      const countNull = getSelectedMonthsCount(null as any);
      expect(countNull).toBe(0);

      const countUndefined = getSelectedMonthsCount(undefined as any);
      expect(countUndefined).toBe(0);
    });
  });

  describe("canExportData", () => {
    it("should return true when aggregated data exists", () => {
      const data: AggregatedData = {
        aggregated: {
          Edukacja: {
            "Program A": {
              Warsztaty: { people: 10, actionNumber: 5 },
            },
          },
        },
        allPeople: 10,
        allActions: 5,
      };

      const result = canExportData(data);
      expect(result).toBe(true);
    });

    it("should return false when aggregated data is null", () => {
      const result = canExportData(null);
      expect(result).toBe(false);
    });

    it("should return true even with empty aggregated object", () => {
      const data: AggregatedData = {
        aggregated: {},
        allPeople: 0,
        allActions: 0,
      };

      // The function checks if aggregatedData is not null
      const result = canExportData(data);
      expect(result).toBe(true);
    });
  });

  describe("shouldAutoProcess", () => {
    it("should return true when all conditions are met and auto-processing is enabled", () => {
      const result = shouldAutoProcess(10, 3, null, true);
      expect(result).toBe(true);
    });

    it("should return false when auto-processing is disabled", () => {
      const result = shouldAutoProcess(10, 3, null, false);
      expect(result).toBe(false);
    });

    it("should return false when no raw data exists", () => {
      const result = shouldAutoProcess(0, 3, null, true);
      expect(result).toBe(false);
    });

    it("should return false when no months are selected", () => {
      const result = shouldAutoProcess(10, 0, null, true);
      expect(result).toBe(false);
    });

    it("should return false when existing data already exists", () => {
      const existingData: AggregatedData = {
        aggregated: {},
        allPeople: 10,
        allActions: 5,
      };
      const result = shouldAutoProcess(10, 3, existingData, true);
      expect(result).toBe(false);
    });

    it("should default to true for autoProcessingEnabled parameter", () => {
      const result = shouldAutoProcess(10, 3, null);
      expect(result).toBe(true);
    });

    it("should handle edge cases with negative values gracefully", () => {
      const result = shouldAutoProcess(-1, 3, null, true);
      expect(result).toBe(false);
    });

    it("should handle zero raw data length", () => {
      const result = shouldAutoProcess(0, 3, null, true);
      expect(result).toBe(false);
    });

    it("should handle negative selected months count", () => {
      const result = shouldAutoProcess(10, -1, null, true);
      expect(result).toBe(false);
    });

    it("should handle all parameters at boundary values", () => {
      const result = shouldAutoProcess(1, 1, null, true);
      expect(result).toBe(true);
    });

    it("should handle very large numbers", () => {
      const result = shouldAutoProcess(999999, 12, null, true);
      expect(result).toBe(true);
    });
  });

  describe("getCurrentError", () => {
    it("should return fileError when it exists", () => {
      const error = getCurrentError("File error", null, null);
      expect(error).toBe("File error");
    });

    it("should return monthError when fileError doesn't exist", () => {
      const error = getCurrentError(null, "Month error", null);
      expect(error).toBe("Month error");
    });

    it("should return processingError when other errors don't exist", () => {
      const error = getCurrentError(null, null, "Processing error");
      expect(error).toBe("Processing error");
    });

    it("should return null when no errors exist", () => {
      const error = getCurrentError(null, null, null);
      expect(error).toBeNull();
    });

    it("should prioritize fileError over other errors", () => {
      const error = getCurrentError("File error", "Month error", "Processing error");
      expect(error).toBe("File error");
    });

    it("should prioritize monthError over processingError", () => {
      const error = getCurrentError(null, "Month error", "Processing error");
      expect(error).toBe("Month error");
    });

    it("should handle empty strings as errors", () => {
      const error = getCurrentError("", null, null);
      expect(error).toBe("");
    });

    it("should handle all errors being empty strings", () => {
      const error = getCurrentError("", "", "");
      expect(error).toBe("");
    });

    it("should handle undefined errors", () => {
      const error = getCurrentError(undefined as any, undefined as any, undefined as any);
      expect(error).toBeNull();
    });
  });
});
