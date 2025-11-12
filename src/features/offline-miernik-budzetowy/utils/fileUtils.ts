import ExcelJS from "exceljs";
import * as XLSX from "xlsx";
import { VALID_FILE_EXTENSIONS, MAX_FILE_SIZE, ERROR_MESSAGES, type ExcelRow } from "../types";
import { createFileTypeError, createFileSizeError, createFileCorruptionError, formatErrorForDisplay } from "./errorHandler";
import { debugLogger } from "./debugLogger";

/**
 * Validates if a file is a valid Excel file
 */
export const validateExcelFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file extension
  const hasValidExtension = VALID_FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

  if (!hasValidExtension) {
    const error = createFileTypeError(file.name);
    return {
      isValid: false,
      error: formatErrorForDisplay(error),
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const fileSizeMB = Math.round((file.size / (1024 * 1024)) * 10) / 10;
    const error = createFileSizeError(fileSizeMB);
    return {
      isValid: false,
      error: formatErrorForDisplay(error),
    };
  }

  return { isValid: true };
};

/**
 * Reads Excel file and returns parsed data
 */
export const readExcelFile = (file: File): Promise<{ fileName: string; data: ExcelRow[] }> => {
  debugLogger.fileUpload(file.name, "start", { size: file.size, type: file.type });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) {
          debugLogger.error("No arrayBuffer from file reader", new Error("FileReader returned null"));
          const error = createFileCorruptionError(new Error("No data from file reader"));
          reject(new Error(formatErrorForDisplay(error)));
          return;
        }

        debugLogger.fileUpload(file.name, "success");
        debugLogger.excelParsing("start", { fileName: file.name });
        try {
          // Use XLSX for reading - much more tolerant to file structure issues
          const workbook = XLSX.read(new Uint8Array(arrayBuffer as ArrayBuffer), {
            type: "array",
            cellNF: false,
            cellFormula: false,
          });

          debugLogger.excelParsing("headers", { worksheetNames: workbook.SheetNames });

          const firstSheetName = workbook.SheetNames[0];
          if (!firstSheetName) {
            debugLogger.error("No worksheet found in workbook", new Error("Empty workbook"));
            const error = createFileCorruptionError(new Error("No worksheet found"));
            reject(new Error(formatErrorForDisplay(error)));
            return;
          }

          // Convert to JSON - XLSX handles this much better
          const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
            blankrows: false,
            raw: true, // Get raw values including Excel date serials
          }) as ExcelRow[];

          debugLogger.excelParsing("rows", { totalRawRows: rawRows.length, firstRowSample: rawRows[0] });

          // Convert Excel date serial numbers to ISO strings for "Data" column
          const rows = rawRows.map((row, rowIndex) => {
            const normalizedRow: ExcelRow = {};

            Object.entries(row).forEach(([key, value]) => {
              // Check if this is the "Data" column and value is a number (Excel date serial)
              if (key === "Data" && typeof value === "number") {
                try {
                  // Excel date serial: days since 1900-01-01
                  const jsDate = new Date((value - 25569) * 86400 * 1000);
                  const year = jsDate.getFullYear();
                  const month = String(jsDate.getMonth() + 1).padStart(2, "0");
                  const day = String(jsDate.getDate()).padStart(2, "0");
                  const isoDate = `${year}-${month}-${day}`;
                  normalizedRow[key] = isoDate;

                  if (rowIndex < 3) {
                    debugLogger.info(`Date converted: ${value} -> ${isoDate}`, undefined, "DateConversion");
                  }
                } catch (dateError) {
                  debugLogger.warn(`Failed to convert date: ${value}`, dateError, "DateConversion");
                  normalizedRow[key] = String(value);
                }
              } else {
                normalizedRow[key] = value;
              }
            });

            return normalizedRow;
          });

          if (rows.length === 0) {
            debugLogger.warn("Excel sheet is empty or has no data rows", undefined, "ExcelParsing");
          } else {
            debugLogger.excelParsing("complete", { totalRows: rows.length, firstRow: rows[0] });
          }

          resolve({
            fileName: file.name,
            data: rows,
          });
        } catch (error: unknown) {
          debugLogger.fileUpload(file.name, "error", error);
          reject(error instanceof Error ? error : new Error(ERROR_MESSAGES.FILE_READ_ERROR));
        }
      } catch (error) {
        const errorObj = createFileCorruptionError(error instanceof Error ? error : new Error(String(error)));
        debugLogger.error("File reading exception", errorObj, "FileRead");
        reject(new Error(formatErrorForDisplay(errorObj)));
      }
    };

    reader.onerror = () => {
      const error = createFileCorruptionError(new Error("File read failed"));
      debugLogger.error("FileReader error event", error, "FileRead");
      reject(new Error(formatErrorForDisplay(error)));
    };

    reader.readAsArrayBuffer(file);
  });
};
