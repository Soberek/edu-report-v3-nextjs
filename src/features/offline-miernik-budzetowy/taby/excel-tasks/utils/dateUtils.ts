import moment from "moment";

/**
 * Date parsing and formatting utilities for IZRZ form
 * Handles multiple input formats and converts to standardized ISO format (YYYY-MM-DD)
 */

const SUPPORTED_FORMATS = [
  "YYYY-MM-DD",
  "YYYY-MM-DDTHH:mm:ss.SSSZ", // ISO with timezone
  "YYYY-MM-DDTHH:mm:ss.SSS",
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss",
  "DD.MM.YYYY",
  "DD-MM-YYYY",
  "DD/MM/YYYY",
  "YYYY/MM/DD",
  "DD.MM.YY",
  "DD-MM-YY",
  "DD/MM/YY",
];

const DISPLAY_FORMAT = "DD.MM.YYYY";
const ISO_FORMAT = "YYYY-MM-DD";

/**
 * Parse various date formats to ISO format (YYYY-MM-DD)
 * Used internally by form and validation schema
 *
 * @param dateValue - Date in various formats (string, number, Date object)
 * @returns ISO format string (YYYY-MM-DD), or today's date if parsing fails
 */
export function parseDateToIso(dateValue: unknown): string {
  if (!dateValue) return moment().format(ISO_FORMAT);

  try {
    let m: moment.Moment;

    if (typeof dateValue === "string") {
      m = moment(dateValue.trim(), SUPPORTED_FORMATS, true);
    } else if (typeof dateValue === "number") {
      // Handle Excel serial numbers (days since 1900-01-01)
      m = moment("1900-01-01", ISO_FORMAT).add(dateValue - 1, "days");
    } else if (dateValue instanceof Date) {
      m = moment(dateValue);
    } else {
      m = moment(String(dateValue));
    }

    if (m.isValid()) {
      return m.format(ISO_FORMAT);
    }
  } catch {
    // Fallback to default
  }

  return moment().format(ISO_FORMAT);
}

/**
 * Format ISO date (YYYY-MM-DD) to display format (DD.MM.YYYY)
 * Used when showing date in form input and in table
 *
 * @param isoDate - Date in ISO format (YYYY-MM-DD)
 * @returns Formatted date (DD.MM.YYYY)
 */
export function formatDateDisplay(isoDate: string): string {
  try {
    const parsed = moment(isoDate, ISO_FORMAT, true);
    if (parsed.isValid()) {
      return parsed.format(DISPLAY_FORMAT);
    }
    return "Invalid date";
  } catch {
    return "Invalid date";
  }
}

/**
 * Get list of supported date formats for validation
 * Used by Zod schema to validate date input
 */
export function getSupportedDateFormats(): string[] {
  return Array.from(SUPPORTED_FORMATS);
}

/**
 * Get expected display format string for user-facing labels
 */
export function getDateDisplayFormat(): string {
  return DISPLAY_FORMAT;
}
