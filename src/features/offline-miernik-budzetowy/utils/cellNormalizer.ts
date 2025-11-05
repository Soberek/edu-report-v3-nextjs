import ExcelJS from "exceljs";

/**
 * Normalizes various cell value types to string or number.
 * Handles: null, undefined, numbers, strings, dates, booleans, and ExcelJS-specific types.
 */
export function normalizeCellValue(cell: ExcelJS.Cell): string | number {
  const value = cell.value;

  // Handle null and undefined
  if (value == null) {
    return "";
  }

  // Handle numbers
  if (typeof value === "number") {
    return value;
  }

  // Handle strings
  if (typeof value === "string") {
    return value;
  }

  // Handle dates
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Handle booleans
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  // Fallback: use cell.text or convert to string
  return cell.text ?? String(value);
}

/**
 * Normalizes a row of cells to key-value pairs.
 */
export function normalizeRowData(row: ExcelJS.Row, headers: string[]): { data: Record<string, string | number>; hasValue: boolean } {
  const rowData: Record<string, string | number> = {};
  let hasValue = false;

  headers.forEach((header, index) => {
    if (!header) return;

    const cell = row.getCell(index + 1);
    const normalizedValue = normalizeCellValue(cell);

    if (normalizedValue !== "") {
      hasValue = true;
    }

    rowData[header] = normalizedValue;
  });

  return { data: rowData, hasValue };
}
