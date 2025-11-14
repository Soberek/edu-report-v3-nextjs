import * as XLSX from "xlsx";
import { z } from "zod";
import { ExcelRow } from "../types";
import { debugLogger } from "./debugLogger";

/**
 * Parses and validates an Excel file buffer using XLSX library.
 * Returns validated rows according to provided schema.
 *
 * @param arrayBuffer - Binary Excel file data
 * @param schema - Zod schema for row validation
 * @returns Validated rows as ExcelRow[]
 * @throws Error if parsing or validation fails
 */
export async function parseExcelFile(arrayBuffer: ArrayBuffer, schema: z.ZodSchema): Promise<ExcelRow[]> {
  debugLogger.excelParsing("start", { bufferSize: arrayBuffer.byteLength });

  if (!arrayBuffer) {
    debugLogger.error("Empty arrayBuffer provided", new Error("No data"));
    throw new Error("Failed to read file data");
  }

  try {
    // Use XLSX for parsing - more tolerant to file structure issues
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
      type: "array",
      cellNF: false,
      cellFormula: false,
    });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      debugLogger.error("No worksheet found in workbook", new Error("Empty workbook"));
      throw new Error("Brak arkusza w pliku");
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    debugLogger.excelParsing("headers", { worksheetName: firstSheetName });

    // Parse to JSON with raw values to handle dates properly
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      blankrows: false,
      raw: true, // Get raw values including date serial numbers
      dateNF: "yyyy-mm-dd", // Date format
    }) as ExcelRow[];

    debugLogger.excelParsing("rows", { totalRawRows: rawData.length });

    // Convert Excel date serial numbers to ISO strings
    const normalizedData = rawData.map((row, rowIndex) => {
      const normalizedRow: ExcelRow = {};

      Object.entries(row).forEach(([key, value]) => {
        // Check if this is the "Data" column and value is a number (Excel date serial)
        if (key === "Data" && typeof value === "number") {
          try {
            // Excel date serial: days since 1900-01-01
            // Use XLSX built-in date conversion
            const jsDate = new Date((value - 25569) * 86400 * 1000); // Convert Excel serial to JS timestamp
            const year = jsDate.getFullYear();
            const month = String(jsDate.getMonth() + 1).padStart(2, "0");
            const day = String(jsDate.getDate()).padStart(2, "0");
            const isoDate = `${year}-${month}-${day}`;
            normalizedRow[key] = isoDate;

            if (rowIndex < 3) {
              debugLogger.debug(`Converted date: ${value} -> ${isoDate}`, undefined, "ExcelParser");
            }
          } catch (dateError) {
            debugLogger.warn(`Failed to convert date value: ${value}`, dateError, "ExcelParser");
            normalizedRow[key] = String(value); // Fallback to string
          }
        } else {
          normalizedRow[key] = value;
        }
      });

      return normalizedRow;
    });

    // Validate each row against schema
    const data: ExcelRow[] = [];
    const errors: string[] = [];

    normalizedData.forEach((rowData, index) => {
      const rowNumber = index + 2; // +2 because Excel is 1-indexed and we skip header

      try {
        const validatedRow = schema.parse(rowData);
        data.push(validatedRow as ExcelRow);
        if (data.length <= 3) {
          debugLogger.excelParsing("rows", { rowNumber, valid: true });
        }
      } catch (error) {
        const errorMsg =
          error instanceof z.ZodError
            ? error.issues.map((e: z.ZodIssue) => `Row ${rowNumber}: ${e.path.join(".")} - ${e.message}`).join("; ")
            : `Row ${rowNumber}: Validation failed`;

        errors.push(errorMsg);
        debugLogger.warn(`Validation error in row ${rowNumber}`, error, "ExcelParser");
      }
    });

    // If there are validation errors, throw them all together
    if (errors.length > 0) {
      debugLogger.error("Excel validation failed", { errorCount: errors.length, errors }, "ExcelParser");
      throw new Error(`Validation errors:\n${errors.join("\n")}`);
    }

    debugLogger.excelParsing("complete", { totalRows: data.length });
    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Validation errors")) {
      throw error; // Re-throw validation errors as-is
    }

    debugLogger.error("XLSX parsing error", error, "ExcelParser");
    const message = error instanceof Error ? error.message : "Failed to parse Excel file";
    throw new Error(`Excel parsing error: ${message}`);
  }
}
