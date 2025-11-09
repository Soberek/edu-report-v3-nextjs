import moment from "moment";
import type { ExcelRow, Month } from "../types";

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
 * Checks if a row has at least one filled field (partially filled)
 * Used to distinguish between completely empty rows and partially filled incomplete rows
 * Only counts fields that have actual meaningful content (not just zeros)
 * @param row Excel row to check
 * @returns true if row has at least one non-empty, meaningful value
 */
export const isRowPartiallyFilled = (row: ExcelRow): boolean => {
  // Count how many meaningful fields have values
  const meaningfulFields = ["Typ programu", "Nazwa programu", "Działanie", "Liczba ludzi", "Liczba działań", "Data"];

  return meaningfulFields.some((field) => {
    const value = row[field];
    if (value === null || value === undefined) return false;
    const strValue = String(value).trim();
    // Must be non-empty and not just a zero
    return strValue !== "" && strValue !== "0";
  });
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
 * Checks if a row is a non-program visit (NIEPROGRAMOWE) with a visit action (wizytacja)
 * These rows should be excluded from calculations as per business rules
 * @param row Excel row to check
 * @returns true if program type is "NIEPROGRAMOWE" and action is "wizytacja"
 */
export const isNonProgramVisitWithWizytacja = (row: ExcelRow): boolean => {
  const programType = String(row["Typ programu"] || "").trim();
  const action = String(row["Działanie"] || "").trim();
  return programType.toLowerCase().includes("nieprogramowe") && action.toLowerCase() === "wizytacja";
};

/**
 * Checks if a row is a lecture (Wykład) with less than 50 people
 * These rows should show a warning but still be included in data
 * @param row Excel row to check
 * @returns true if action is "Wykład" and people count is less than 50
 */
export const isLectureWithLessThan50People = (row: ExcelRow): boolean => {
  const action = String(row["Działanie"] || "").trim();
  const people = row["Liczba ludzi"];
  const peopleCount = typeof people === "number" ? people : typeof people === "string" ? parseFloat(people) : 0;

  return action.toLowerCase() === "wykład" && peopleCount > 0 && peopleCount < 50;
};

/**
 * Checks if a row is a workshop (Warsztat) with more than 10 people
 * These rows should show a warning but still be included in data
 * @param row Excel row to check
 * @returns true if action is "Warsztat" and people count is more than 10
 */
export const isWorkshopWithMoreThan10People = (row: ExcelRow): boolean => {
  const action = String(row["Działanie"] || "").trim();
  const people = row["Liczba ludzi"];
  const peopleCount = typeof people === "number" ? people : typeof people === "string" ? parseFloat(people) : 0;

  return action.toLowerCase() === "warsztaty" && peopleCount > 10;
};

/**
 * Checks if a row is "Publikacja media" with non-zero people count
 * "Publikacja media" should not have audience (people count should be 0)
 * @param row Excel row to check
 * @returns true if action starts with "Publikacja media" and people count is not 0
 */
export const isMediaPublicationWithPeople = (row: ExcelRow): boolean => {
  const action = String(row["Działanie"] || "").trim();
  const people = row["Liczba ludzi"];
  const peopleCount = typeof people === "number" ? people : typeof people === "string" ? parseFloat(people) : 0;

  return action.toLowerCase().startsWith("publikacja media") && peopleCount !== 0;
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
  const completelyEmptyRowNumbers: number[] = [];
  const incompleteRowNumbers: number[] = [];
  const nonProgramWizytacjaRowNumbers: number[] = [];
  const lectureWithLessThan50RowNumbers: number[] = [];
  const workshopWithMoreThan10RowNumbers: number[] = [];
  const mediaPublicationWithPeopleRowNumbers: number[] = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because row 1 is header, index starts at 0

    // Track completely empty rows (all cells blank) - these are ignored completely
    if (isCompletelyEmptyRow(row)) {
      completelyEmptyRowNumbers.push(rowNumber);
      return; // Skip other checks for completely empty rows
    }

    // Track rows with missing required fields BUT that have some data (partially filled)
    if (isRowEmpty(row) && isRowPartiallyFilled(row)) {
      incompleteRowNumbers.push(rowNumber);
    }

    // Track non-program visits with wizytacja action
    if (isNonProgramVisitWithWizytacja(row)) {
      nonProgramWizytacjaRowNumbers.push(rowNumber);
    }

    // Track lectures with less than 50 people
    if (isLectureWithLessThan50People(row)) {
      lectureWithLessThan50RowNumbers.push(rowNumber);
    }

    // Track workshops with more than 10 people
    if (isWorkshopWithMoreThan10People(row)) {
      workshopWithMoreThan10RowNumbers.push(rowNumber);
    }

    // Track "Publikacja media" with non-zero people count
    if (isMediaPublicationWithPeople(row)) {
      mediaPublicationWithPeopleRowNumbers.push(rowNumber);
    }
  });

  const warnings: string[] = [];

  // Only show warning for incomplete rows (have data but missing required fields), NOT completely empty rows
  if (incompleteRowNumbers.length > 0) {
    const rowsText = incompleteRowNumbers.slice(0, 5).join(", ");
    const moreText = incompleteRowNumbers.length > 5 ? `, ... i ${incompleteRowNumbers.length - 5} więcej` : "";
    warnings.push(`Pominięto ${incompleteRowNumbers.length} niekompletnych wierszy (${rowsText}${moreText})`);
  }

  if (nonProgramWizytacjaRowNumbers.length > 0) {
    const rowsText = nonProgramWizytacjaRowNumbers.slice(0, 5).join(", ");
    const moreText = nonProgramWizytacjaRowNumbers.length > 5 ? `, ... i ${nonProgramWizytacjaRowNumbers.length - 5} więcej` : "";
    warnings.push(`Pominięto ${nonProgramWizytacjaRowNumbers.length} wierszy (NIEPROGRAMOWE + wizytacja) (${rowsText}${moreText})`);
  }

  if (lectureWithLessThan50RowNumbers.length > 0) {
    const rowsText = lectureWithLessThan50RowNumbers.slice(0, 5).join(", ");
    const moreText = lectureWithLessThan50RowNumbers.length > 5 ? `, ... i ${lectureWithLessThan50RowNumbers.length - 5} więcej` : "";
    warnings.push(`⚠️ ${lectureWithLessThan50RowNumbers.length} wykład(ów) z mniej niż 50 odbiorców (${rowsText}${moreText})`);
  }

  if (workshopWithMoreThan10RowNumbers.length > 0) {
    const rowsText = workshopWithMoreThan10RowNumbers.slice(0, 5).join(", ");
    const moreText = workshopWithMoreThan10RowNumbers.length > 5 ? `, ... i ${workshopWithMoreThan10RowNumbers.length - 5} więcej` : "";
    warnings.push(`⚠️ ${workshopWithMoreThan10RowNumbers.length} warsztaty z więcej niż 10 odbiorców (${rowsText}${moreText})`);
  }

  if (mediaPublicationWithPeopleRowNumbers.length > 0) {
    const rowsText = mediaPublicationWithPeopleRowNumbers.slice(0, 5).join(", ");
    const moreText =
      mediaPublicationWithPeopleRowNumbers.length > 5 ? `, ... i ${mediaPublicationWithPeopleRowNumbers.length - 5} więcej` : "";
    warnings.push(
      `⚠️ ${mediaPublicationWithPeopleRowNumbers.length} "Publikacja media" z odbiorcami (liczba ludzi > 0) (${rowsText}${moreText})`
    );
  }

  return { filteredRowNumbers: completelyEmptyRowNumbers.concat(incompleteRowNumbers), warnings };
};

/**
 * Filters Excel data to show only rows from selected months
 * Used in ExcelTasksTable to display only relevant month data
 * Automatically filters out invalid/empty rows
 *
 * @param data Array of Excel rows
 * @param selectedMonths Array of month objects with selected flag
 * @returns Filtered rows that match selected months and are valid (not empty)
 */
export const filterDataBySelectedMonths = (data: ExcelRow[], selectedMonths: Month[]): ExcelRow[] => {
  const selectedMonthNumbers = selectedMonths.filter((m) => m.selected).map((m) => m.monthNumber);

  if (selectedMonthNumbers.length === 0) {
    return []; // No months selected
  }

  return data.filter((row) => {
    // Skip empty rows
    if (isCompletelyEmptyRow(row)) return false;
    if (isRowEmpty(row)) return false;

    const dateStr = String(row["Data"] || "");
    if (!dateStr) return false; // Skip rows without date

    const month = moment(dateStr, "YYYY-MM-DD").month() + 1;
    return selectedMonthNumbers.includes(month);
  });
};
