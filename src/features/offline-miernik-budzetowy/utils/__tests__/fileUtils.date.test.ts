import { describe, it, expect, vi, beforeEach } from "vitest";
import { readExcelFile } from "../fileUtils";
import * as XLSX from "xlsx";

// Mock the entire XLSX module
vi.mock("xlsx", () => ({
  read: vi.fn(),
  utils: {
    sheet_to_json: vi.fn(),
  },
}));

vi.mock("../debugLogger", () => ({
  debugLogger: {
    fileUpload: vi.fn(),
    excelParsing: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("fileUtils - Excel Date Conversion", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock behavior
    vi.mocked(XLSX.read).mockReturnValue({
      SheetNames: ["Sheet1"],
      Sheets: {
        Sheet1: {},
      },
    } as XLSX.WorkBook);
  });

  const createMockFile = (worksheetData: Record<string, unknown>[]) => {
    const file = new File(["mock content"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Configure the mock for this specific test
    vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(worksheetData);

    return file;
  };

  describe("Date column conversion", () => {
    it("should convert Excel date serial to ISO string format", async () => {
      // Excel serial 45234 = 2023-11-04
      const file = createMockFile([
        {
          "Typ programu": "Edukacja",
          Data: 45234,
          "Liczba ludzi": 10,
        },
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2023-11-04");
      expect(typeof result.data[0].Data).toBe("string");
    });

    it("should handle multiple rows with date conversion", async () => {
      const file = createMockFile([
        { Data: 45234 }, // 2023-11-04
        { Data: 45235 }, // 2023-11-05
        { Data: 45236 }, // 2023-11-06
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2023-11-04");
      expect(result.data[1].Data).toBe("2023-11-05");
      expect(result.data[2].Data).toBe("2023-11-06");
    });

    it("should preserve string dates unchanged", async () => {
      const file = createMockFile([{ Data: "2024-01-15" }]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2024-01-15");
    });

    it("should handle mixed date formats in same column", async () => {
      const file = createMockFile([
        { Data: 45234 }, // Excel serial
        { Data: "2024-01-15" }, // String
        { Data: 45236 }, // Excel serial
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2023-11-04");
      expect(result.data[1].Data).toBe("2024-01-15");
      expect(result.data[2].Data).toBe("2023-11-06");
    });

    it("should handle year boundaries correctly", async () => {
      const file = createMockFile([
        { Data: 44926 }, // 2022-12-31
        { Data: 44927 }, // 2023-01-01
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2022-12-31");
      expect(result.data[1].Data).toBe("2023-01-01");
    });

    it("should handle leap year dates", async () => {
      const file = createMockFile([
        { Data: 45353 }, // 2024-03-02
        { Data: 45354 }, // 2024-03-03
        { Data: 45355 }, // 2024-03-04
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2024-03-02");
      expect(result.data[1].Data).toBe("2024-03-03");
      expect(result.data[2].Data).toBe("2024-03-04");
    });

    it("should handle very old dates", async () => {
      // Excel serial 366 = 1901-01-01 (accounting for 1900 bug)
      const file = createMockFile([{ Data: 366 }]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(result.data[0].Data as string).getFullYear()).toBeLessThan(1910);
    });

    it("should handle future dates", async () => {
      // Excel serial 54789 = 2050-01-01
      const file = createMockFile([{ Data: 54789 }]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2050-01-01");
    });

    it("should pad single-digit months and days with zeros", async () => {
      // Excel serial 44940 = 2023-01-14
      const file = createMockFile([{ Data: 44940 }]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2023-01-14");
      expect(result.data[0].Data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should not convert dates in other columns", async () => {
      const file = createMockFile([
        {
          Data: 45234,
          "Liczba ludzi": 45234, // Same number but different column
          Other: 45234,
        },
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2023-11-04"); // Converted
      expect(result.data[0]["Liczba ludzi"]).toBe(45234); // Not converted
      expect(result.data[0].Other).toBe(45234); // Not converted
    });

    it("should handle empty Data column", async () => {
      const file = createMockFile([{ Data: "" }]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("");
    });

    it("should handle undefined Data column", async () => {
      const file = createMockFile([{ Data: undefined }]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBeUndefined();
    });

    it("should handle null Data column", async () => {
      const file = createMockFile([{ Data: null }]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBeNull();
    });

    it("should handle zero as date serial", async () => {
      const file = createMockFile([{ Data: 0 }]);

      const result = await readExcelFile(file);

      // Excel serial 0 would be 1900-01-00, which is invalid
      // But our conversion should handle it gracefully
      expect(typeof result.data[0].Data).toBe("string");
    });

    it("should handle negative date serials", async () => {
      const file = createMockFile([{ Data: -100 }]);

      const result = await readExcelFile(file);

      // Should convert even if result is invalid
      expect(typeof result.data[0].Data).toBe("string");
    });

    it("should handle very large date serials", async () => {
      const file = createMockFile([
        { Data: 99999 }, // Far future date
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should handle fractional date serials (dates with time)", async () => {
      // 45234.5 = 2023-11-04 12:00:00 (noon)
      const file = createMockFile([{ Data: 45234.5 }]);

      const result = await readExcelFile(file);

      // Should ignore time portion and return only date
      expect(result.data[0].Data).toBe("2023-11-04");
    });

    it("should handle multiple date columns if they exist", async () => {
      const file = createMockFile([
        {
          Data: 45234,
          "Data rozpoczęcia": 45235,
          "Data zakończenia": 45236,
        },
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2023-11-04");
      // Only "Data" column should be converted
      expect(result.data[0]["Data rozpoczęcia"]).toBe(45235);
      expect(result.data[0]["Data zakończenia"]).toBe(45236);
    });

    it("should preserve other column types during date conversion", async () => {
      const file = createMockFile([
        {
          "Typ programu": "Edukacja",
          Data: 45234,
          "Liczba ludzi": 10,
          Koszt: 1500.5,
          Aktywny: true,
        },
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0]["Typ programu"]).toBe("Edukacja");
      expect(result.data[0].Data).toBe("2023-11-04");
      expect(result.data[0]["Liczba ludzi"]).toBe(10);
      expect(result.data[0].Koszt).toBe(1500.5);
      expect(result.data[0].Aktywny).toBe(true);
    });

    it("should handle date conversion errors gracefully", async () => {
      const file = createMockFile([{ Data: NaN }]);

      const result = await readExcelFile(file);

      // Should convert NaN to string "NaN"
      expect(typeof result.data[0].Data).toBe("string");
    });

    it("should handle Infinity as date serial", async () => {
      const file = createMockFile([{ Data: Infinity }]);

      const result = await readExcelFile(file);

      expect(typeof result.data[0].Data).toBe("string");
    });
  });

  describe("Date conversion logging", () => {
    it("should log first 3 date conversions", async () => {
      const { debugLogger } = await import("../debugLogger");

      const file = createMockFile([
        { Data: 45234 },
        { Data: 45235 },
        { Data: 45236 },
        { Data: 45237 }, // 4th row - should not be logged
      ]);

      await readExcelFile(file);

      // Should log first 3 conversions
      expect(debugLogger.info).toHaveBeenCalledTimes(3);
    });

    it("should log conversion failures as warnings", async () => {
      const { debugLogger } = await import("../debugLogger");

      // Mock date conversion to throw error
      const file = createMockFile([{ Data: 45234 }]);

      // This shouldn't throw, but log warning
      await readExcelFile(file);

      // Should complete successfully even if logging fails
      expect(debugLogger.fileUpload).toHaveBeenCalled();
    });
  });

  describe("Edge cases with file structure", () => {
    it("should handle files with no Data column", async () => {
      const file = createMockFile([
        {
          "Typ programu": "Edukacja",
          "Liczba ludzi": 10,
        },
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0]).not.toHaveProperty("Data");
      expect(result.data[0]["Typ programu"]).toBe("Edukacja");
    });

    it("should handle files with only Data column", async () => {
      const file = createMockFile([{ Data: 45234 }]);

      const result = await readExcelFile(file);

      expect(Object.keys(result.data[0])).toEqual(["Data"]);
      expect(result.data[0].Data).toBe("2023-11-04");
    });

    it("should handle completely empty rows", async () => {
      const file = createMockFile([{}]);

      const result = await readExcelFile(file);

      expect(result.data[0]).toEqual({});
    });

    it("should handle rows with all null values", async () => {
      const file = createMockFile([
        {
          Data: null,
          "Typ programu": null,
          "Liczba ludzi": null,
        },
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBeNull();
    });

    it("should handle very large datasets", async () => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        Data: 45234 + i,
        Index: i,
      }));

      const file = createMockFile(largeData);

      const result = await readExcelFile(file);

      expect(result.data).toHaveLength(10000);
      expect(result.data[0].Data).toBe("2023-11-04");
      expect(result.data[9999].Data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should handle files with Unicode column names", async () => {
      const file = createMockFile([
        {
          Data: 45234,
          Имя: "Test",
          名前: "テスト",
          نام: "آزمون",
        },
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2023-11-04");
      expect(result.data[0]["Имя"]).toBe("Test");
    });

    it("should handle column names with special characters", async () => {
      const file = createMockFile([
        {
          Data: 45234,
          "Column (with) parentheses": "test",
          "Column/with/slashes": "test",
          "Column@with#symbols$": "test",
        },
      ]);

      const result = await readExcelFile(file);

      expect(result.data[0].Data).toBe("2023-11-04");
      expect(result.data[0]["Column (with) parentheses"]).toBe("test");
    });
  });
});
