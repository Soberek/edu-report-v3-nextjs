/**
 * Date and time utilities for the Szkoły w Programie feature.
 */

const SCHOOL_YEAR_START_MONTH = 9; // September

/**
 * Gets the current school year (e.g., "2024/2025").
 * School year starts in September.
 *
 * @example
 * // If current date is November 2024:
 * getCurrentSchoolYear() // → "2024/2025"
 * // If current date is August 2024:
 * getCurrentSchoolYear() // → "2023/2024"
 */
export const getCurrentSchoolYear = (): string => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11

  // School year starts in September
  const schoolYearStart =
    currentMonth >= SCHOOL_YEAR_START_MONTH ? currentYear : currentYear - 1;
  return `${schoolYearStart}/${schoolYearStart + 1}`;
};

/**
 * Checks if a school year string is valid.
 * @param year - School year string (e.g., "2024/2025")
 * @returns true if year matches valid format and is in allowed range
 */
export const isValidSchoolYear = (year: string): boolean => {
  const validYears = [
    '2024/2025',
    '2025/2026',
    '2026/2027',
    '2027/2028',
  ];
  return validYears.includes(year);
};

/**
 * Formats date to Polish locale.
 * @param date - Date object or ISO string
 * @returns Formatted date string in Polish (e.g., "1 listopada 2024")
 */
export const formatDateToPolish = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
