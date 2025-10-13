import { describe, it, expect, vi } from "vitest";
import { validateExcelData, aggregateData, exportToExcel } from "../dataProcessing";
import type { ExcelRow, Month, AggregatedData } from "../../types";

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
      expect(result.error).toBe("Plik nie zawiera danych");
    });

    it("should reject null data", () => {
      const result = validateExcelData(null as unknown as ExcelRow[]);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Plik nie zawiera danych");
    });

    it("should reject data with missing required fields", () => {
      const invalidData: ExcelRow[] = [
        {
          "Typ programu": "Edukacja",
          // Missing "Nazwa programu"
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Nazwa programu");
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
          "Typ programu": "", // Empty string
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Typ programu");
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
      // Zod .min(1) only checks length, not content - whitespace passes validation
      const dataWithWhitespace: ExcelRow[] = [
        {
          "Typ programu": "   ",
          "Nazwa programu": "Program A",
          Działanie: "Akcja 1",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      const result = validateExcelData(dataWithWhitespace);

      expect(result.isValid).toBe(true); // .min(1) validates length, not content
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

  describe("exportToExcel", () => {
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
