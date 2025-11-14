import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseExcelFile } from "../excelParser";
import { z } from "zod";
import ExcelJS from "exceljs";

describe("excelParser", () => {
  describe("parseExcelFile", () => {
    let mockWorkbook: ExcelJS.Workbook;
    let mockWorksheet: ExcelJS.Worksheet;

    beforeEach(() => {
      mockWorkbook = new ExcelJS.Workbook();
      mockWorksheet = mockWorkbook.addWorksheet("Sheet1");
    });

    it("should return empty array if arrayBuffer is empty or invalid", async () => {
      const schema = z.object({ name: z.string() });

      // XLSX library returns empty array for invalid/empty buffers instead of throwing
      const result = await parseExcelFile(new ArrayBuffer(0), schema);
      expect(result).toEqual([]);
    });

    it("should throw error if no worksheets found", async () => {
      const workbook = new ExcelJS.Workbook();
      const buffer = await workbook.xlsx.writeBuffer();

      const schema = z.object({ name: z.string() });

      await expect(parseExcelFile(buffer as ArrayBuffer, schema)).rejects.toThrow("Brak arkusza w pliku");
    });

    it("should parse valid Excel rows with correct schema", async () => {
      mockWorksheet.columns = [
        { header: "name", key: "name" },
        { header: "age", key: "age" },
      ];

      mockWorksheet.addRow({ name: "John", age: 30 });
      mockWorksheet.addRow({ name: "Jane", age: 28 });

      const buffer = await mockWorkbook.xlsx.writeBuffer();

      const schema = z.object({
        name: z.string(),
        age: z.union([z.string(), z.number()]),
      });

      const result = await parseExcelFile(buffer as ArrayBuffer, schema);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("John");
      expect(result[1].name).toBe("Jane");
    });

    it("should not skip empty rows (XLSX behavior)", async () => {
      mockWorksheet.columns = [{ header: "name", key: "name" }];

      mockWorksheet.addRow({ name: "John" });
      mockWorksheet.addRow({ name: "" }); // Empty string row
      mockWorksheet.addRow({ name: "Jane" });

      const buffer = await mockWorkbook.xlsx.writeBuffer();

      const schema = z.object({ name: z.string() });

      const result = await parseExcelFile(buffer as ArrayBuffer, schema);

      // XLSX returns all rows including empty strings
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("John");
      expect(result[1].name).toBe("");
      expect(result[2].name).toBe("Jane");
    });

    it("should throw error with validation errors for invalid data", async () => {
      mockWorksheet.columns = [{ header: "email", key: "email" }];

      mockWorksheet.addRow({ email: "invalid-email" });

      const buffer = await mockWorkbook.xlsx.writeBuffer();

      const schema = z.object({
        email: z.string().email(),
      });

      await expect(parseExcelFile(buffer as ArrayBuffer, schema)).rejects.toThrow("Validation errors");
    });

    it("should handle data transformation in schema", async () => {
      mockWorksheet.columns = [{ header: "count", key: "count" }];

      mockWorksheet.addRow({ count: "5" }); // String that should be transformed to number

      const buffer = await mockWorkbook.xlsx.writeBuffer();

      const schema = z.object({
        count: z.union([z.string(), z.number()]).transform((val) => {
          const num = typeof val === "string" ? parseFloat(val) : val;
          return isNaN(num) ? 0 : num;
        }),
      });

      const result = await parseExcelFile(buffer as ArrayBuffer, schema);

      expect(result).toHaveLength(1);
      expect(result[0].count).toBe(5);
    });
  });
});
