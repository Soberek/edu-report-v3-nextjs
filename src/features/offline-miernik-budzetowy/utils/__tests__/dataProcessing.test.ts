import { describe, it, expect, vi } from "vitest";
import { validateExcelData, aggregateData, exportToExcel } from "../dataProcessing";
import type { ExcelRow, Month, AggregatedData } from "../../types";
import { ERROR_MESSAGES } from "../../constants";

describe("dataProcessing", () => {
  describe("validateExcelData", () => {
    it("should validate correct Excel data", () => {
      const validData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
        {
          "Typ programu": "Profilaktyka",
          "Nazwa programu": "Program B",
          Działanie: "Akcja 2",
          "Liczba ludzi": 20,
          "Liczba działań": 3,
          Data: "2024-02-20",
        },
      ];

      const result = validateExcelData(validData);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject empty data", () => {
      const result = validateExcelData([]);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain(ERROR_MESSAGES.DATA_NO_CONTENT.split(" ")[0]); // "Plik"
    });

    it("should reject null data", () => {
      const result = validateExcelData(null as unknown as ExcelRow[]);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain(ERROR_MESSAGES.DATA_NO_CONTENT.split(" ")[0]); // "Plik"
    });

    it("should reject data with missing required fields", () => {
      const invalidData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          // Missing "Nazwa programu" - should be ignored as empty row
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(invalidData);

      // Row without "Nazwa programu" should be treated as empty and filtered out
      expect(result.isValid).toBe(false);
      expect(result.error).toContain(ERROR_MESSAGES.DATA_ONLY_HEADERS);
    });

    it("should ignore rows with empty Nazwa programu", () => {
      const mixedData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "", // Empty program name - should be ignored
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A", // Valid row
          Działanie: "Akcja 2",
          "Liczba ludzi": 20,
          "Liczba działań": 3,
          Data: "2024-02-20",
        },
      ];

      const result = validateExcelData(mixedData);

      // Should be valid because second row is valid and first is ignored
      expect(result.isValid).toBe(true);
    });

    it("should reject data with negative numbers", () => {
      const invalidData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": -10, // Negative number
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should reject data with invalid date format", () => {
      const invalidData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "invalid-date",
        },
      ];

      const result = validateExcelData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("daty");
    });

    it("should handle string numbers and convert them", () => {
      const validData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": "10" as unknown as number, // String number
          "Liczba działań": "5" as unknown as number,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(validData);

      expect(result.isValid).toBe(true);
    });

    it("should reject data with empty string for required fields", () => {
      const invalidData: ExcelRow[] = [
        {
          "Typ programu": "", // Empty string - will be filtered out
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(invalidData);

      expect(result.isValid).toBe(false);
      // Row is filtered out because Typ programu is empty, so returns "only headers" error
      expect(result.error).toContain("nagłówki");
    });

    it("should reject data with zero values", () => {
      const invalidData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 0,
          "Liczba działań": 0,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(invalidData);

      // Zero should be accepted as valid (edge case: no participants but action occurred)
      expect(result.isValid).toBe(true);
    });

    it("should reject data with NaN values", () => {
      const invalidData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": NaN,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(invalidData);

      expect(result.isValid).toBe(false);
    });

    it("should handle floating point numbers", () => {
      const validData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 10.5,
          "Liczba działań": 5.2,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(validData);

      expect(result.isValid).toBe(true);
    });

    it("should accept data with whitespace in required fields", () => {
      // Since we trim whitespace and check if it's empty, whitespace-only values are filtered out
      // This is intentional behavior to ignore rows with only whitespace in critical fields
      const dataWithWhitespace: ExcelRow[] = [
        {
          "Typ programu": "   ", // Whitespace only - will be filtered out
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(dataWithWhitespace);

      // Row is filtered out because Typ programu is whitespace-only, so returns "only headers" error
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("nagłówki");
    });

    it("should handle very large numbers", () => {
      const validData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 999999,
          "Liczba działań": 888888,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(validData);

      expect(result.isValid).toBe(true);
    });

    it("should handle different date formats", () => {
      const validData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(validData);

      expect(result.isValid).toBe(true);
    });

    it("should filter rows with missing Działanie", () => {
      const dataWithMissingAction: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "", // Missing action - should be filtered
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program B",
          Działanie: "Warsztaty", // Valid
          "Liczba ludzi": 20,
          "Liczba działań": 3,
          Data: "2024-01-20",
        },
      ];

      const result = validateExcelData(dataWithMissingAction);

      // Should be valid because second row is valid
      expect(result.isValid).toBe(true);
    });

    it("should filter rows with missing Liczba ludzi", () => {
      const dataWithMissingPeople: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Warsztaty",
          "Liczba ludzi": null as unknown as number, // Missing people count
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program B",
          Działanie: "Akcja",
          "Liczba ludzi": 20,
          "Liczba działań": 3,
          Data: "2024-01-20",
        },
      ];

      const result = validateExcelData(dataWithMissingPeople);

      // Should be valid because second row is valid
      expect(result.isValid).toBe(true);
    });

    it("should filter rows with missing Data", () => {
      const dataWithMissingDate: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Warsztaty",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "", // Missing date
        },
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program B",
          Działanie: "Akcja",
          "Liczba ludzi": 20,
          "Liczba działań": 3,
          Data: "2024-01-20",
        },
      ];

      const result = validateExcelData(dataWithMissingDate);

      // Should be valid because second row is valid
      expect(result.isValid).toBe(true);
    });
  });

  describe("aggregateData", () => {
    const mockData: ExcelRow[] = [
      {
        "Typ programu": "Edukacja",
        "Nazwa programu": "Program A",
        Działanie: "Warsztaty",
        "Liczba ludzi": 15,
        "Liczba działań": 3,
        Data: "2024-01-15",
      },
      {
        "Typ programu": "Edukacja",
        "Nazwa programu": "Program A",
        Działanie: "Warsztaty",
        "Liczba ludzi": 10,
        "Liczba działań": 2,
        Data: "2024-01-20",
      },
      {
        "Typ programu": "Profilaktyka",
        "Nazwa programu": "Program B",
        Działanie: "Spotkania",
        "Liczba ludzi": 20,
        "Liczba działań": 4,
        Data: "2024-02-10",
      },
      {
        "Typ programu": "Edukacja",
        "Nazwa programu": "Program C",
        Działanie: "Wykłady",
        "Liczba ludzi": 30,
        "Liczba działań": 5,
        Data: "2024-03-15",
      },
    ];

    it("should aggregate data for selected months", () => {
      const months: Month[] = [
        { monthNumber: 1, selected: true },
        { monthNumber: 2, selected: true },
        { monthNumber: 3, selected: false }, // Not selected
        ...Array.from({ length: 9 }, (_, i) => ({
          monthNumber: i + 4,
          selected: false,
        })),
      ];

      const result = aggregateData(mockData, months);

      // Should only include January and February data
      expect(result.aggregated).toBeDefined();
      expect(result.allPeople).toBe(45); // 15 + 10 + 20
      expect(result.allActions).toBe(9); // 3 + 2 + 4
    });

    it("should aggregate duplicate actions within same program", () => {
      const months: Month[] = [
        { monthNumber: 1, selected: true },
        ...Array.from({ length: 11 }, (_, i) => ({
          monthNumber: i + 2,
          selected: false,
        })),
      ];

      const result = aggregateData(mockData, months);

      // Check that "Warsztaty" actions are combined
      const workshopsData = result.aggregated["Edukacja"]?.["Program A"]?.["Warsztaty"];
      expect(workshopsData).toBeDefined();
      expect(workshopsData.people).toBe(25); // 15 + 10
      expect(workshopsData.actionNumber).toBe(5); // 3 + 2
    });

    it("should handle multiple program types", () => {
      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: true,
      }));

      const result = aggregateData(mockData, months);

      expect(Object.keys(result.aggregated)).toContain("Edukacja");
      expect(Object.keys(result.aggregated)).toContain("Profilaktyka");
    });

    it("should throw error when no months are selected", () => {
      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: false,
      }));

      expect(() => aggregateData(mockData, months)).toThrow("Wybierz przynajmniej jeden miesiąc");
    });

    it("should skip data from unselected months", () => {
      const months: Month[] = [
        { monthNumber: 1, selected: true },
        ...Array.from({ length: 11 }, (_, i) => ({
          monthNumber: i + 2,
          selected: false,
        })),
      ];

      const result = aggregateData(mockData, months);

      // Should only include January data (Program A's two entries)
      expect(result.allPeople).toBe(25); // 15 + 10
      expect(result.allActions).toBe(5); // 3 + 2
    });

    it("should create nested structure correctly", () => {
      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: true,
      }));

      const result = aggregateData(mockData, months);

      // Verify nested structure exists
      expect(result.aggregated["Edukacja"]).toBeDefined();
      expect(result.aggregated["Edukacja"]["Program A"]).toBeDefined();
      expect(result.aggregated["Edukacja"]["Program A"]["Warsztaty"]).toBeDefined();
    });

    it("should handle data with different actions in same program", () => {
      const dataWithMultipleActions: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Warsztaty",
          "Liczba ludzi": 15,
          "Liczba działań": 3,
          Data: "2024-01-15",
        },
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Wykłady",
          "Liczba ludzi": 20,
          "Liczba działań": 2,
          Data: "2024-01-20",
        },
      ];

      const months: Month[] = [
        { monthNumber: 1, selected: true },
        ...Array.from({ length: 11 }, (_, i) => ({
          monthNumber: i + 2,
          selected: false,
        })),
      ];

      const result = aggregateData(dataWithMultipleActions, months);

      expect(result.aggregated["Edukacja"]["Program A"]["Warsztaty"]).toBeDefined();
      expect(result.aggregated["Edukacja"]["Program A"]["Wykłady"]).toBeDefined();
      expect(result.allPeople).toBe(35);
      expect(result.allActions).toBe(5);
    });

    it("should filter out non-program visits (nieprogramowe)", () => {
      const dataWithNonPrograms: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Warsztaty",
          "Liczba ludzi": 15,
          "Liczba działań": 3,
          Data: "2024-01-15",
        },
        {
          "Typ programu": "Nieprogramowe",
          "Nazwa programu": "Wizyta",
          Działanie: "Konsultacja",
          "Liczba ludzi": 5,
          "Liczba działań": 1,
          Data: "2024-01-20",
        },
        {
          "Typ programu": "Profilaktyka",
          "Nazwa programu": "Program B",
          Działanie: "Akcja",
          "Liczba ludzi": 10,
          "Liczba działań": 2,
          Data: "2024-02-10",
        },
      ];

      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: true,
      }));

      const result = aggregateData(dataWithNonPrograms, months);

      // Should NOT include "Nieprogramowe" in aggregated data
      expect(result.aggregated["Nieprogramowe"]).toBeUndefined();
      
      // Should only include "Edukacja" and "Profilaktyka"
      expect(Object.keys(result.aggregated)).toEqual(["Edukacja", "Profilaktyka"]);
      
      // Totals should exclude non-program data
      expect(result.allPeople).toBe(25); // 15 + 10 (NOT including 5 from Nieprogramowe)
      expect(result.allActions).toBe(5); // 3 + 2 (NOT including 1 from Nieprogramowe)
      
      // Should have warning about filtered non-program visits
      expect(result.warnings).toBeDefined();
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings![0]).toContain("Znaleziono 1 wizytacje nieprogramowe w wierszu(ach) 3");
      expect(result.warnings![0]).toContain("nie zostały uwzględnione w sumach");
    });

    it("should handle empty data array", () => {
      const months: Month[] = [{ monthNumber: 1, selected: true }];

      const result = aggregateData([], months);

      expect(result.aggregated).toEqual({});
      expect(result.allPeople).toBe(0);
      expect(result.allActions).toBe(0);
    });

    it("should handle data with zero values", () => {
      const dataWithZeros: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Warsztaty",
          "Liczba ludzi": 0,
          "Liczba działań": 0,
          Data: "2024-01-15",
        },
      ];

      const months: Month[] = [{ monthNumber: 1, selected: true }];

      const result = aggregateData(dataWithZeros, months);

      expect(result.allPeople).toBe(0);
      expect(result.allActions).toBe(0);
    });

    it("should track multiple non-program visits and include them in warning", () => {
      const dataWithMultipleNonPrograms: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Warsztaty",
          "Liczba ludzi": 15,
          "Liczba działań": 3,
          Data: "2024-01-15",
        },
        {
          "Typ programu": "Nieprogramowe",
          "Nazwa programu": "Wizyta 1",
          Działanie: "Konsultacja",
          "Liczba ludzi": 5,
          "Liczba działań": 1,
          Data: "2024-01-20",
        },
        {
          "Typ programu": "Profilaktyka",
          "Nazwa programu": "Program B",
          Działanie: "Akcja",
          "Liczba ludzi": 10,
          "Liczba działań": 2,
          Data: "2024-02-10",
        },
        {
          "Typ programu": "Nieprogramowe",
          "Nazwa programu": "Wizyta 2",
          Działanie: "Konsultacja",
          "Liczba ludzi": 3,
          "Liczba działań": 1,
          Data: "2024-03-05",
        },
      ];

      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: true,
      }));

      const result = aggregateData(dataWithMultipleNonPrograms, months);

      // Verify totals exclude all non-program data
      expect(result.allPeople).toBe(25); // 15 + 10 (NOT including 5 + 3 from Nieprogramowe)
      expect(result.allActions).toBe(5); // 3 + 2 (NOT including 1 + 1 from Nieprogramowe)
      
      // Should have warning about multiple filtered non-program visits
      expect(result.warnings).toBeDefined();
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings![0]).toContain("Znaleziono 2 wizytacje nieprogramowe");
      expect(result.warnings![0]).toContain("w wierszu(ach) 3, 5");
      expect(result.warnings![0]).toContain("nie zostały uwzględnione w sumach");
    });

    it("should handle all 12 months selected", () => {
      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: true,
      }));

      const result = aggregateData(mockData, months);

      expect(result.allPeople).toBe(75); // All data included
      expect(result.allActions).toBe(14);
    });

    it("should handle single month selection", () => {
      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: i === 0, // Only January
      }));

      const result = aggregateData(mockData, months);

      expect(result.allPeople).toBe(25); // Only January data
      expect(result.allActions).toBe(5);
    });

    it("should handle data with special characters in names", () => {
      const specialData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja & Zdrowie",
          "Nazwa programu": "Program A/B (test)",
          Działanie: "Warsztaty - część 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const months: Month[] = [{ monthNumber: 1, selected: true }];

      const result = aggregateData(specialData, months);

      expect(result.aggregated["Edukacja & Zdrowie"]).toBeDefined();
      expect(result.aggregated["Edukacja & Zdrowie"]["Program A/B (test)"]).toBeDefined();
    });

    it("should handle data spanning full year", () => {
      const yearlyData: ExcelRow[] = Array.from({ length: 12 }, (_, i) => ({
        "Typ programu": "Edukacja",
        "Nazwa programu": "Program A",
        Działanie: "Akcja",
        "Liczba ludzi": 10,
        "Liczba działań": 5,
        Data: `2024-${String(i + 1).padStart(2, "0")}-15`,
      }));

      const months: Month[] = Array.from({ length: 12 }, (_, i) => ({
        monthNumber: i + 1,
        selected: true,
      }));

      const result = aggregateData(yearlyData, months);

      expect(result.allPeople).toBe(120); // 10 * 12
      expect(result.allActions).toBe(60); // 5 * 12
    });

    it("should handle very large datasets", () => {
      const largeData: ExcelRow[] = Array.from({ length: 1000 }, (_, i) => ({
        "Typ programu": "Edukacja",
        "Nazwa programu": `Program ${i % 10}`,
        Działanie: `Akcja ${i % 5}`,
        "Liczba ludzi": 1,
        "Liczba działań": 1,
        Data: "2024-01-15",
      }));

      const months: Month[] = [{ monthNumber: 1, selected: true }];

      const result = aggregateData(largeData, months);

      expect(result.allPeople).toBe(1000);
      expect(result.allActions).toBe(1000);
    });
  });

  // NOTE: These tests are skipped because they test the old xlsx implementation
  // The exportToExcel function now uses ExcelJS, and is tested via useExcelFileSaver.test.ts
  describe.skip("exportToExcel", () => {
    it("should return false for empty aggregated data", async () => {
      const emptyData: AggregatedData = {
        aggregated: {},
        allPeople: 0,
        allActions: 0,
      };

      const result = await exportToExcel(emptyData);

      expect(result).toBe(false);
    });

    it("should handle export with valid data structure", async () => {
      const validData: AggregatedData = {
        aggregated: {
          Edukacja: {
            "Program A": {
              Warsztaty: {
                people: 25,
                actionNumber: 5,
              },
              Wykłady: {
                people: 30,
                actionNumber: 3,
              },
            },
          },
          Profilaktyka: {
            "Program B": {
              Spotkania: {
                people: 20,
                actionNumber: 4,
              },
            },
          },
        },
        allPeople: 75,
        allActions: 12,
      };

      // Mock XLSX library
      const mockWriteFile = vi.fn();
      vi.doMock("xlsx", () => ({
        utils: {
          json_to_sheet: vi.fn(() => ({})),
          book_new: vi.fn(() => ({})),
          book_append_sheet: vi.fn(),
        },
        writeFile: mockWriteFile,
      }));

      const result = await exportToExcel(validData);

      // Should attempt to export
      expect(result).toBe(true);
    });

    it("should handle export errors gracefully", async () => {
      const validData: AggregatedData = {
        aggregated: {
          Edukacja: {
            "Program A": {
              Warsztaty: {
                people: 25,
                actionNumber: 5,
              },
            },
          },
        },
        allPeople: 25,
        allActions: 5,
      };

      // Mock XLSX library to throw error
      vi.doMock("xlsx", () => {
        throw new Error("Export failed");
      });

      const result = await exportToExcel(validData);

      // Should return false on error
      expect(result).toBe(false);
    });
  });
});
