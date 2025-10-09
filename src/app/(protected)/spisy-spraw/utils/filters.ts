import type { CaseRecord } from "@/types";

/**
 * Filters case records based on selected code
 * 
 * Special handling:
 * - Empty code: returns all records
 * - Code "966": shows all records starting with "OZiPZ.966"
 * - Other codes: exact match on code field
 * 
 * @param records - Array of case records to filter
 * @param selectedCode - The code to filter by
 * @returns Filtered array of case records
 */
export const filterRecordsByCode = (
  records: CaseRecord[],
  selectedCode: string
): CaseRecord[] => {
  if (!selectedCode) {
    return records;
  }

  if (selectedCode === "966") {
    return records.filter((record) =>
      record.referenceNumber.startsWith("OZiPZ.966")
    );
  }

  return records.filter((record) => record.code === selectedCode);
};

/**
 * Sorts records by date in descending order (newest first)
 * Creates a new array to avoid mutation
 * 
 * @param records - Array of case records to sort
 * @returns New sorted array
 */
export const sortRecordsByDate = (records: CaseRecord[]): CaseRecord[] => {
  return [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
