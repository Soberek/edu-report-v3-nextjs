import ExcelJS from "exceljs";
import { z } from "zod";
import { ExcelRow } from "../types";
import { normalizeRowData } from "./cellNormalizer";

/**
 * Parses and validates an Excel file buffer.
 * Returns validated rows according to provided schema.
 *
 * @param arrayBuffer - Binary Excel file data
 * @param schema - Zod schema for row validation
 * @returns Validated rows as ExcelRow[]
 * @throws Error if parsing or validation fails
 */
export async function parseExcelFile(arrayBuffer: ArrayBuffer, schema: z.ZodSchema): Promise<ExcelRow[]> {
  if (!arrayBuffer) {
    throw new Error("Failed to read file data");
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("Brak arkusza w pliku");
  }

  // Extract headers from first row
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const headerValue = cell.value;
    headers[colNumber - 1] = headerValue == null ? "" : String(headerValue);
  });

  // Parse and validate data rows
  const data: ExcelRow[] = [];
  const errors: string[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    // Skip header row
    if (rowNumber === 1) return;

    const { data: rowData, hasValue } = normalizeRowData(row, headers);

    // Skip empty rows
    if (!hasValue) return;

    // Validate row against schema
    try {
      const validatedRow = schema.parse(rowData);
      data.push(validatedRow as ExcelRow);
    } catch (error) {
      const errorMsg =
        error instanceof z.ZodError
          ? error.issues.map((e: z.ZodIssue) => `Row ${rowNumber}: ${e.path.join(".")} - ${e.message}`).join("; ")
          : `Row ${rowNumber}: Validation failed`;

      errors.push(errorMsg);
    }
  });

  // If there are validation errors, throw them all together
  if (errors.length > 0) {
    throw new Error(`Validation errors:\n${errors.join("\n")}`);
  }

  return data;
}
