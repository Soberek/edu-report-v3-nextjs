import { describe, it, expect } from "vitest";
import { validateExcelFile, validateExcelData, aggregateHealthData } from "../fileProcessing";
import { ERROR_MESSAGES, type HealthInspectionRow } from "../../types";

describe("fileProcessing", () => {
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
      const file = new File(["test"], "test.pdf", {
        type: "application/pdf",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE);
    });

    it("should reject files that are too large", () => {
      const largeContent = new Array(11 * 1024 * 1024).fill("a").join("");
      const file = new File([largeContent], "large.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.FILE_TOO_LARGE);
    });

    it("should accept files at the size limit (10MB)", () => {
      const content = new Array(10 * 1024 * 1024).fill("a").join("");
      const file = new File([content], "exact.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const result = validateExcelFile(file);

      expect(result.isValid).toBe(true);
    });
  });

  describe("validateExcelData", () => {
    it("should validate correct data", () => {
      const validData: HealthInspectionRow[] = [
        {
          lp: 1,
          "RODZAJ OBIEKTU": "przedsiębiorstwa podmiotów leczniczych",
          "LICZBA SKONTROLOWANYCH OBIEKTÓW": 16,
          OGÓŁEM: 16,
          "W TYM Z WYKORZYSTANIEM PALARNI": 0,
        },
        {
          lp: 2,
          "RODZAJ OBIEKTU": "jednostki organizacyjne systemu oświaty",
          "LICZBA SKONTROLOWANYCH OBIEKTÓW": 5,
          OGÓŁEM: 5,
          "W TYM Z WYKORZYSTANIEM PALARNI": 1,
        },
      ];

      const result = validateExcelData(validData);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject empty data", () => {
      const result = validateExcelData([]);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.NO_DATA);
    });

    it("should reject data with missing required fields", () => {
      const invalidData = [
        {
          lp: 1,
          "LICZBA SKONTROLOWANYCH OBIEKTÓW": 16,
        },
      ] as unknown as HealthInspectionRow[];

      const result = validateExcelData(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should accept data with undefined numeric fields", () => {
      const validData: HealthInspectionRow[] = [
        {
          "RODZAJ OBIEKTU": "przedsiębiorstwa podmiotów leczniczych",
          "LICZBA SKONTROLOWANYCH OBIEKTÓW": undefined,
          OGÓŁEM: undefined,
          "W TYM Z WYKORZYSTANIEM PALARNI": undefined,
        } as unknown as HealthInspectionRow,
      ];

      const result = validateExcelData(validData);

      expect(result.isValid).toBe(true);
    });

    it("should accept data with empty string numeric fields", () => {
      const validData: HealthInspectionRow[] = [
        {
          "RODZAJ OBIEKTU": "jednostki organizacyjne systemu oświaty",
          "LICZBA SKONTROLOWANYCH OBIEKTÓW": "",
          OGÓŁEM: "",
          "W TYM Z WYKORZYSTANIEM PALARNI": "",
        } as unknown as HealthInspectionRow,
      ];

      const result = validateExcelData(validData);

      expect(result.isValid).toBe(true);
    });
  });

  describe("aggregateHealthData", () => {
    it("should aggregate data from multiple files", () => {
      const filesData = [
        {
          fileName: "file1.xlsx",
          data: [
            {
              "RODZAJ OBIEKTU": "przedsiębiorstwa podmiotów leczniczych",
              "LICZBA SKONTROLOWANYCH OBIEKTÓW": 10,
              OGÓŁEM: 10,
              "W TYM Z WYKORZYSTANIEM PALARNI": 0,
            },
            {
              "RODZAJ OBIEKTU": "jednostki organizacyjne systemu oświaty",
              "LICZBA SKONTROLOWANYCH OBIEKTÓW": 5,
              OGÓŁEM: 5,
              "W TYM Z WYKORZYSTANIEM PALARNI": 1,
            },
          ],
        },
        {
          fileName: "file2.xlsx",
          data: [
            {
              "RODZAJ OBIEKTU": "przedsiębiorstwa podmiotów leczniczych",
              "LICZBA SKONTROLOWANYCH OBIEKTÓW": 6,
              OGÓŁEM: 6,
              "W TYM Z WYKORZYSTANIEM PALARNI": 0,
            },
            {
              "RODZAJ OBIEKTU": "jednostki organizacyjne systemu oświaty",
              "LICZBA SKONTROLOWANYCH OBIEKTÓW": 3,
              OGÓŁEM: 3,
              "W TYM Z WYKORZYSTANIEM PALARNI": 0,
            },
          ],
        },
      ];

      const result = aggregateHealthData(filesData);

      expect(result["przedsiębiorstwa podmiotów leczniczych"]).toEqual({
        skontrolowane: 16,
        realizowane: 16,
        zWykorzystaniemPalarni: 0,
      });

      expect(result["jednostki organizacyjne systemu oświaty"]).toEqual({
        skontrolowane: 8,
        realizowane: 8,
        zWykorzystaniemPalarni: 1,
      });
    });

    it("should handle empty strings and undefined values", () => {
      const filesData = [
        {
          fileName: "file1.xlsx",
          data: [
            {
              "RODZAJ OBIEKTU": "zakłady pracy",
              "LICZBA SKONTROLOWANYCH OBIEKTÓW": "",
              OGÓŁEM: undefined,
              "W TYM Z WYKORZYSTANIEM PALARNI": "",
            },
          ],
        },
      ];

      const result = aggregateHealthData(filesData);

      expect(result["zakłady pracy"]).toEqual({
        skontrolowane: 0,
        realizowane: 0,
        zWykorzystaniemPalarni: 0,
      });
    });

    it("should convert string numbers to numbers", () => {
      const filesData = [
        {
          fileName: "file1.xlsx",
          data: [
            {
              "RODZAJ OBIEKTU": "uczelnie wyższe",
              "LICZBA SKONTROLOWANYCH OBIEKTÓW": "15",
              OGÓŁEM: "15",
              "W TYM Z WYKORZYSTANIEM PALARNI": "2",
            },
          ],
        },
      ];

      const result = aggregateHealthData(filesData);

      expect(result["uczelnie wyższe"]).toEqual({
        skontrolowane: 15,
        realizowane: 15,
        zWykorzystaniemPalarni: 2,
      });
    });

    it("should initialize all facility types even if not present in data", () => {
      const filesData = [
        {
          fileName: "file1.xlsx",
          data: [
            {
              "RODZAJ OBIEKTU": "przedsiębiorstwa podmiotów leczniczych",
              "LICZBA SKONTROLOWANYCH OBIEKTÓW": 10,
              OGÓŁEM: 10,
              "W TYM Z WYKORZYSTANIEM PALARNI": 0,
            },
          ],
        },
      ];

      const result = aggregateHealthData(filesData);

      // Check that all 10 facility types are present
      expect(Object.keys(result).length).toBeGreaterThanOrEqual(10);

      // Check that unrepresented types have zero values
      expect(result["lokale gastronomiczno-rozrywkowe"]).toEqual({
        skontrolowane: 0,
        realizowane: 0,
        zWykorzystaniemPalarni: 0,
      });
    });
  });
});
