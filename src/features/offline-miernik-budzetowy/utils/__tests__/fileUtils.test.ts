import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateExcelFile, readExcelFile } from "../fileUtils";
import { ERROR_MESSAGES } from "../../types";

describe("fileUtils", () => {
  describe("validateExcelFile", () => {
    it("should validate .xlsx files", () => {
      const file = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should validate .xls files", () => {
      const file = new File(["test"], "test.xls", {
        type: "application/vnd.ms-excel",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject non-Excel files", () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE);
    });

    it("should reject .pdf files", () => {
      const file = new File(["test"], "test.pdf", { type: "application/pdf" });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE);
    });

    it("should reject .csv files", () => {
      const file = new File(["test"], "test.csv", { type: "text/csv" });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE);
    });

    it("should reject files larger than 10MB", () => {
      const largeContent = new Array(11 * 1024 * 1024).fill("a").join("");
      const file = new File([largeContent], "large.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.FILE_TOO_LARGE);
    });

    it("should accept files at the size limit (10MB)", () => {
      // Create a file that's exactly 10MB
      const content = new Array(10 * 1024 * 1024).fill("a").join("");
      const file = new File([content], "exact.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });

    it("should handle uppercase file extensions", () => {
      const file = new File(["test"], "TEST.XLSX", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });

    it("should handle mixed case file extensions", () => {
      const file = new File(["test"], "test.XlSx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });

    it("should handle files with multiple dots in name", () => {
      const file = new File(["test"], "my.test.file.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });

    it("should reject files with wrong extension even if mime type is correct", () => {
      const file = new File(["test"], "test.txt", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
    });

    it("should handle files with no extension", () => {
      const file = new File(["test"], "test", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE);
    });

    it("should handle files with just dots in name", () => {
      const file = new File(["test"], "...", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
    });

    it("should handle zero-byte files", () => {
      const file = new File([], "empty.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true); // Size is OK, content validation happens later
    });

    it("should handle files just under size limit", () => {
      const content = new Array(10 * 1024 * 1024 - 1).fill("a").join("");
      const file = new File([content], "almost-max.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });

    it("should handle files just over size limit", () => {
      const content = new Array(10 * 1024 * 1024 + 1).fill("a").join("");
      const file = new File([content], "over-max.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.FILE_TOO_LARGE);
    });

    it("should handle files with special characters in name", () => {
      const file = new File(["test"], "Raport@2024!#$%.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });

    it("should handle files with Unicode characters in name", () => {
      const file = new File(["test"], "Raport_教育_2024.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });

    it("should handle files with very long names", () => {
      const longName = "a".repeat(255) + ".xlsx";
      const file = new File(["test"], longName, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });

    it("should reject .xlsm files (macro-enabled)", () => {
      const file = new File(["test"], "test.xlsm", {
        type: "application/vnd.ms-excel.sheet.macroEnabled.12",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
    });

    it("should reject .xlsb files (binary)", () => {
      const file = new File(["test"], "test.xlsb", {
        type: "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
    });
  });

  // NOTE: These tests are skipped because they test the old xlsx implementation
  // The readExcelFile function now uses ExcelJS, and is tested in useExcelFileReader.test.ts
  describe.skip("readExcelFile", () => {
    beforeEach(() => {
      // Clear all mocks before each test
      vi.clearAllMocks();
    });

    it("should read Excel file and return parsed data", async () => {
      // Mock FileReader
      const mockData = [
        {
          "Typ programu": "Edukacja",
          "Nazwa programu": "Program A",
          Działanie: "Warsztaty",
          "Liczba ludzi": 10,
          "Liczba działań": 5,
          Data: "2024-01-15",
        },
      ];

      // Mock XLSX library
      const mockSheet = {};
      const mockWorkbook = {
        SheetNames: ["Sheet1"],
        Sheets: { Sheet1: mockSheet },
      };

      vi.doMock("xlsx", () => ({
        read: vi.fn(() => mockWorkbook),
        utils: {
          sheet_to_json: vi.fn(() => mockData),
        },
      }));

      const file = new File(["test content"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Mock FileReader
      const originalFileReader = global.FileReader;
      const mockFileReader = {
        readAsArrayBuffer: vi.fn(function (this: FileReader) {
          // Simulate successful read
          if (this.onload) {
            const event = new ProgressEvent("load", {
              lengthComputable: true,
              loaded: 8,
              total: 8,
            });
            Object.defineProperty(event, "target", {
              value: { result: new ArrayBuffer(8) },
            });
            this.onload(event as ProgressEvent<FileReader>);
          }
        }),
        onerror: null,
        onload: null,
      };

      global.FileReader = vi.fn(() => {
        const instance = Object.create(mockFileReader);
        instance.onerror = function () {
          if (instance.onerror) {
            const errorEvent = new ProgressEvent("error", {
              lengthComputable: false,
              loaded: 0,
              total: 0,
            });
            Object.defineProperty(errorEvent, "target", {
              value: this,
            });
            this.onerror(errorEvent as ProgressEvent<FileReader>);
          }
        };
        instance.onload = function () {
          if (instance.onload) {
            const loadEvent = new ProgressEvent("load", {
              lengthComputable: true,
              loaded: 8,
              total: 8,
            });
            Object.defineProperty(loadEvent, "target", {
              value: { result: new ArrayBuffer(8) },
            });
            instance.onload(loadEvent as ProgressEvent<FileReader>);
          }
        };
        return instance;
      }) as unknown as typeof FileReader;

      const promise = readExcelFile(file);

      // Wait for the promise to resolve
      await expect(promise).resolves.toEqual({
        fileName: "test.xlsx",
        data: mockData,
      });

      // Restore original FileReader
      global.FileReader = originalFileReader;
    });

    it("should reject when FileReader fails", async () => {
      const file = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Mock FileReader to fail
      const originalFileReader = global.FileReader;
      const mockFileReader = {
        readAsArrayBuffer: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            const errorEvent = new ProgressEvent("error", {
              lengthComputable: false,
              loaded: 0,
              total: 0,
            });
            console.error("Mock FileReader error event", errorEvent);
            Object.defineProperty(errorEvent, "target", {
              value: this,
            });
            this.onerror?.(errorEvent as ProgressEvent<FileReader>);
          }, 0);
        }),
        onload: null as FileReader["onload"],
        onerror: null as FileReader["onerror"],
      };

      global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;

      await expect(readExcelFile(file)).rejects.toThrow(ERROR_MESSAGES.FILE_READ_ERROR);

      global.FileReader = originalFileReader;
    });

    it("should reject when arrayBuffer is null", async () => {
      const file = new File(["test"], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const originalFileReader = global.FileReader;
      const mockFileReader = {
        readAsArrayBuffer: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            this.onload?.({ target: { result: null } } as ProgressEvent<FileReader>);
          }, 0);
        }),
        onload: null as FileReader["onload"],
        onerror: null as FileReader["onerror"],
      };

      global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;

      await expect(readExcelFile(file)).rejects.toThrow(ERROR_MESSAGES.FILE_READ_ERROR);

      global.FileReader = originalFileReader;
    });

    it("should preserve file name", async () => {
      const mockData = [{ test: "data" }];
      const mockSheet = {};
      const mockWorkbook = {
        SheetNames: ["Sheet1"],
        Sheets: { Sheet1: mockSheet },
      };

      vi.doMock("xlsx", () => ({
        read: vi.fn(() => mockWorkbook),
        utils: {
          sheet_to_json: vi.fn(() => mockData),
        },
      }));

      const file = new File(["test"], "my-budget-file.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const originalFileReader = global.FileReader;
      const mockFileReader = {
        readAsArrayBuffer: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            if (this.onload) {
              const loadEvent = new ProgressEvent("load", {
                lengthComputable: true,
                loaded: 8,
                total: 8,
              });
              Object.defineProperty(loadEvent, "target", {
                value: { result: new ArrayBuffer(8) },
              });
              this.onload(loadEvent as ProgressEvent<FileReader>);
            }
          }, 0);
        }),
        onerror: null,
        onload: null,
      };

      global.FileReader = vi.fn(() => {
        const instance = Object.create(mockFileReader);
        instance.onerror = function () {
          if (instance.onerror) {
            const errorEvent = new ProgressEvent("error", {
              lengthComputable: false,
              loaded: 0,
              total: 0,
            });
            Object.defineProperty(errorEvent, "target", {
              value: this,
            });
            this.onerror(errorEvent as ProgressEvent<FileReader>);
          }
        };
        instance.onload = function () {
          if (instance.onload) {
            const loadEvent = new ProgressEvent("load", {
              lengthComputable: true,
              loaded: 8,
              total: 8,
            });
            Object.defineProperty(loadEvent, "target", {
              value: { result: new ArrayBuffer(8) },
            });
            instance.onload(loadEvent as ProgressEvent<FileReader>);
          }
        };
        return instance;
      }) as unknown as typeof FileReader;

      const result = await readExcelFile(file);

      expect(result.fileName).toBe("my-budget-file.xlsx");

      global.FileReader = originalFileReader;
    });
  });
});
