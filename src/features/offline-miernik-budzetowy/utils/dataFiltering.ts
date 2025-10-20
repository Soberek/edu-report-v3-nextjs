import type { ExcelRow } from "../types";

/**
 * Checks if a row is completely empty (all cells are empty/undefined)
 * This is used to filter out blank rows from Excel tables
 *
 * @param row Excel row to check
 * @returns true if the row contains no meaningful data at all
 */
export const isCompletelyEmptyRow = (row: ExcelRow): boolean => {
  // Check if all values in the row are empty/null/undefined
  return Object.values(row).every((value) => {
    if (value === null || value === undefined) return true;
    const strValue = String(value).trim();
    return strValue === "" || strValue === "0";
  });
};

/**
 * Checks if a row has any meaningful content (not just empty strings or zeros)
 * Returns true if any of the required fields are missing:
 * - "Typ programu" (program type) is required and must not be empty
 * - "Nazwa programu" (program name) is required and must not be empty
 * - "Działanie" (action) is required and must not be empty
 * - "Liczba ludzi" (people count) is required
 * - "Liczba działań" (action count) is required
 * - "Data" (date) is required and must not be empty
 */
export const isRowEmpty = (row: ExcelRow): boolean => {
  const typProgramu = String(row["Typ programu"] || "").trim();
  const nazwaProgramu = String(row["Nazwa programu"] || "").trim();
  const dzialanie = String(row["Działanie"] || "").trim();
  const liczbaLudzi = row["Liczba ludzi"];
  const liczbaDialan = row["Liczba działań"];
  const data = String(row["Data"] || "").trim();

  // Row is empty/invalid if any required field is missing or empty
  return (
    typProgramu === "" ||
    nazwaProgramu === "" ||
    dzialanie === "" ||
    liczbaLudzi === null ||
    liczbaLudzi === undefined ||
    liczbaDialan === null ||
    liczbaDialan === undefined ||
    data === ""
  );
};

/**
 * Checks if a row represents a non-program visit (nieprogramowe)
 * @param row Excel row to check
 * @returns true if the program type contains "nieprogramowe"
 */
export const isNonProgramVisit = (row: ExcelRow): boolean => {
  const programType = String(row["Typ programu"] || "").trim();
  return programType.toLowerCase().includes("nieprogramowe");
};

/**
 * Filters Excel data to remove invalid and non-program rows
 * Performs filtering in a central location to ensure consistency across all aggregation functions
 *
 * @param data Raw Excel rows to filter
 * @returns Filtered array containing only valid program rows
 *
 * Filtering removes:
 * 1. Completely empty rows (all cells blank) - silently
 * 2. Rows with missing required fields (Nazwa programu, Działanie, Liczba ludzi, Data, etc.) - silently
 * 3. Non-program visits (rows where "Typ programu" contains "nieprogramowe") - silently
 */
export const filterExcelData = (data: ExcelRow[]): ExcelRow[] => {
  return data.filter((row) => {
    // Skip completely empty rows (blank Excel rows)
    if (isCompletelyEmptyRow(row)) {
      return false;
    }

    // Skip rows with missing required fields
    if (isRowEmpty(row)) {
      return false;
    }

    // Skip non-program visits
    if (isNonProgramVisit(row)) {
      return false;
    }

    return true;
  });
};

/**
 * Tracks which rows were filtered out and returns warnings
 * Useful for informing users about excluded data
 * 
 * Note: Only reports non-program visits as warnings. Completely empty rows are silently filtered out
 * since Excel files often contain many blank rows that don't need user notification.
 *
 * @param data Raw Excel rows to check
 * @returns Object containing row numbers of filtered rows and warning messages
 */
export const getFilteringWarnings = (data: ExcelRow[]): { filteredRowNumbers: number[]; warnings: string[] } => {
  const nonProgramRowNumbers: number[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because row 1 is header, index starts at 0

    // Only track non-program visits as warnings
    // Completely empty rows are silently ignored (common in Excel files)
    if (!isCompletelyEmptyRow(row) && !isRowEmpty(row) && isNonProgramVisit(row)) {
      nonProgramRowNumbers.push(rowNumber);
    }
  });

  const warnings: string[] = [];

  if (nonProgramRowNumbers.length > 0) {
    const rowsText = nonProgramRowNumbers.join(", ");
    warnings.push(
      `Znaleziono ${nonProgramRowNumbers.length} wizytacje nieprogramowe w wierszu(ach) ${rowsText} - nie zostały uwzględnione w sumach.`
    );
  }

  return { filteredRowNumbers: nonProgramRowNumbers, warnings };
};
