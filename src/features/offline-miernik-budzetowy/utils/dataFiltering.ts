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
 * Checks if a row represents a non-program visit (NIEPROGRAMOWE) with a visit action (wizytacja)
 * These rows should be excluded from calculations as per business rules
 * @param row Excel row to check
 * @returns true if program type is "NIEPROGRAMOWE" and action is "wizytacja"
 */
export const isNonProgramVisitWithWizytacja = (row: ExcelRow): boolean => {
  const programType = String(row["Typ programu"] || "").trim();
  const action = String(row["Działanie"] || "").trim();
  return (
    programType.toLowerCase().includes("nieprogramowe") &&
    action.toLowerCase() === "wizytacja"
  );
};

/**
 * Filters Excel data to remove invalid rows (but keeps both program and non-program visits)
 * Performs filtering in a central location to ensure consistency across all aggregation functions
 *
 * @param data Raw Excel rows to filter
 * @returns Filtered array containing valid rows (both program and non-program)
 *
 * Filtering removes:
 * 1. Completely empty rows (all cells blank) - silently
 * 2. Rows with missing required fields (Nazwa programu, Działanie, Liczba ludzi, Data, etc.) - silently
 *
 * Note: Non-program visits are NOT filtered out here - they are included and displayed separately
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

    // NOTE: Non-program visits are NOT filtered here - they will be displayed separately

    return true;
  });
};

/**
 * Tracks which rows were filtered out and returns warnings
 * Useful for informing users about excluded data
 * 
 * Note: Reports only completely empty or invalid rows as warnings.
 * Non-program visits are now included in data and displayed separately.
 * Non-program visits with "wizytacja" action are excluded from calculations with a warning.
 *
 * @param data Raw Excel rows to check
 * @returns Object containing row numbers of filtered rows and warning messages
 */
export const getFilteringWarnings = (data: ExcelRow[]): { filteredRowNumbers: number[]; warnings: string[] } => {
  const invalidRowNumbers: number[] = [];
  const nonProgramWizytacjaRowNumbers: number[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because row 1 is header, index starts at 0

    // Track completely empty rows and rows with missing required fields
    if (isCompletelyEmptyRow(row) || isRowEmpty(row)) {
      invalidRowNumbers.push(rowNumber);
    }

    // Track non-program visits with wizytacja action
    if (isNonProgramVisitWithWizytacja(row)) {
      nonProgramWizytacjaRowNumbers.push(rowNumber);
    }
  });

  const warnings: string[] = [];

  if (invalidRowNumbers.length > 0) {
    const rowsText = invalidRowNumbers.slice(0, 5).join(", ");
    const moreText = invalidRowNumbers.length > 5 ? `, ... i ${invalidRowNumbers.length - 5} więcej` : "";
    warnings.push(
      `Pominięto ${invalidRowNumbers.length} niepoprawnych/niekompletnych wierszy (${rowsText}${moreText})`
    );
  }

  if (nonProgramWizytacjaRowNumbers.length > 0) {
    const rowsText = nonProgramWizytacjaRowNumbers.slice(0, 5).join(", ");
    const moreText = nonProgramWizytacjaRowNumbers.length > 5 ? `, ... i ${nonProgramWizytacjaRowNumbers.length - 5} więcej` : "";
    warnings.push(
      `Pominięto ${nonProgramWizytacjaRowNumbers.length} wierszy (NIEPROGRAMOWE + wizytacja) (${rowsText}${moreText})`
    );
  }

  return { filteredRowNumbers: invalidRowNumbers, warnings };
};
