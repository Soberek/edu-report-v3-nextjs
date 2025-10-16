import ExcelJS from "exceljs";
import { VALID_FILE_EXTENSIONS, MAX_FILE_SIZE, ERROR_MESSAGES, type ExcelRow } from "../types";

/**
 * Validates if a file is a valid Excel file
 */
export const validateExcelFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file extension
  const hasValidExtension = VALID_FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }

  return { isValid: true };
};

/**
 * Reads Excel file and returns parsed data
 */
export const readExcelFile = (file: File): Promise<{ fileName: string; data: ExcelRow[] }> => {
  console.log("📂 DEBUG: readExcelFile called for:", file.name);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) {
          console.log("❌ DEBUG: No arrayBuffer from file reader");
          throw new Error(ERROR_MESSAGES.FILE_READ_ERROR);
        }

        console.log("✅ DEBUG: File read successfully, parsing with ExcelJS...");
        (async () => {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(arrayBuffer as ArrayBuffer);
          const worksheet = workbook.worksheets[0];

          if (!worksheet) {
            console.log("❌ DEBUG: No worksheet found in workbook");
            throw new Error(ERROR_MESSAGES.FILE_READ_ERROR);
          }

          console.log("📊 DEBUG: Worksheet found, name:", worksheet.name);
          console.log("📊 DEBUG: Row count:", worksheet.rowCount);

          const headerRow = worksheet.getRow(1);
          const headers: string[] = [];
          headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const value = cell.value;
            headers[colNumber - 1] = value == null ? "" : String(value);
          });

          console.log("📋 DEBUG: Headers extracted:", headers);
          console.log("📋 DEBUG: Headers count:", headers.length);

          const normalizeCellValue = (cell: ExcelJS.Cell): string | number => {
            const cellValue = cell.value;

            if (cellValue == null) {
              return "";
            }

            if (typeof cellValue === "number") {
              return cellValue;
            }

            if (typeof cellValue === "string") {
              return cellValue;
            }

            if (cellValue instanceof Date) {
              return cellValue.toISOString();
            }

            if (typeof cellValue === "boolean") {
              return cellValue ? "TRUE" : "FALSE";
            }

            return cell.text ?? String(cellValue);
          };

          const rows: ExcelRow[] = [];

          worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const rowData: ExcelRow = {};
            let hasValue = false;

            headers.forEach((header, index) => {
              if (!header) return;

              const cell = row.getCell(index + 1);
              const normalized = normalizeCellValue(cell);

              if (normalized !== "") {
                hasValue = true;
              }

              rowData[header] = normalized;
            });

            if (hasValue) {
              rows.push(rowData);
              if (rows.length <= 3) {
                console.log(`📄 DEBUG: Row ${rowNumber} parsed:`, JSON.stringify(rowData, null, 2));
              }
            }
          });

          console.log("✅ DEBUG: Total rows parsed:", rows.length);
          console.log("📊 DEBUG: First row sample:", rows[0] ? JSON.stringify(rows[0], null, 2) : "No rows");

          resolve({
            fileName: file.name,
            data: rows,
          });
        })().catch((error: unknown) => {
          reject(error instanceof Error ? error : new Error(ERROR_MESSAGES.FILE_READ_ERROR));
        });
      } catch {
        reject(new Error(ERROR_MESSAGES.FILE_READ_ERROR));
      }
    };

    reader.onerror = () => {
      reject(new Error(ERROR_MESSAGES.FILE_READ_ERROR));
    };

    reader.readAsArrayBuffer(file);
  });
};
