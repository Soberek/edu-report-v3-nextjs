import type { CaseRecord } from "@/types";

/**
 * Searches case records by query across multiple fields
 *
 * @param records - Array of case records
 * @param query - Search query string
 * @returns Filtered array of records matching the search query
 */
export const searchRecords = (records: CaseRecord[], query: string): CaseRecord[] => {
  if (!query || query.trim() === "") return records;

  const lowerQuery = query.toLowerCase().trim();

  return records.filter((record) => {
    const searchableFields = [record.code, record.referenceNumber, record.title, record.sender, record.comments, record.notes];

    return searchableFields.some((field) => field && field.toLowerCase().includes(lowerQuery));
  });
};

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
export const filterRecordsByCode = (records: CaseRecord[], selectedCode: string): CaseRecord[] => {
  if (!selectedCode) {
    return records;
  }

  if (selectedCode === "966") {
    return records.filter((record) => record.referenceNumber.startsWith("OZiPZ.966"));
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
  return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Suggests the next available reference number based on existing records
 * Pattern: OZiPZ.966.X.Y.2025 where X and Y are incrementing numbers
 *
 * @param records - Array of existing case records
 * @param basePattern - Base pattern to match (default: "OZiPZ.966")
 * @returns Suggested next reference number
 */
export const suggestNextReferenceNumber = (records: CaseRecord[], basePattern: string = "OZiPZ.966"): string => {
  const currentYear = new Date().getFullYear();
  const pattern = new RegExp(`^${basePattern}\\.(\\d+)\\.(\\d+)\\.${currentYear}$`);

  let maxFirstNum = 0;
  let maxSecondNum = 0;

  // Find all matching reference numbers and track the highest numbers
  records.forEach((record) => {
    const match = record.referenceNumber.match(pattern);
    if (match) {
      const firstNum = parseInt(match[1], 10);
      const secondNum = parseInt(match[2], 10);

      if (firstNum > maxFirstNum) {
        maxFirstNum = firstNum;
        maxSecondNum = secondNum;
      } else if (firstNum === maxFirstNum && secondNum > maxSecondNum) {
        maxSecondNum = secondNum;
      }
    }
  });

  // If no records found with this pattern, start with 1.1
  if (maxFirstNum === 0 && maxSecondNum === 0) {
    return `${basePattern}.1.1.${currentYear}`;
  }

  // Increment the second number, or increment first number if second reaches a high value
  let nextFirstNum = maxFirstNum;
  let nextSecondNum = maxSecondNum + 1;

  // If second number gets too high, increment first number and reset second
  if (nextSecondNum > 99) {
    nextFirstNum += 1;
    nextSecondNum = 1;
  }

  return `${basePattern}.${nextFirstNum}.${nextSecondNum}.${currentYear}`;
};
