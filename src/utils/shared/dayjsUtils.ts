import dayjs from "dayjs";
import "dayjs/locale/pl";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize dayjs with plugins and Polish locale
dayjs.locale("pl");
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Default timezone for the application
const DEFAULT_TIMEZONE = "Europe/Warsaw";

/**
 * Format date for display with Polish localization
 */
export const formatDate = (date: string | Date | dayjs.Dayjs, format: "short" | "medium" | "long" | "full" = "medium"): string => {
  const dateObj = dayjs(date).tz(DEFAULT_TIMEZONE);

  switch (format) {
    case "short":
      return dateObj.format("DD.MM.YYYY");
    case "medium":
      return dateObj.format("DD MMM YYYY");
    case "long":
      return dateObj.format("D MMMM YYYY");
    case "full":
      return dateObj.format("dddd, D MMMM YYYY");
    default:
      return dateObj.format("DD.MM.YYYY");
  }
};

/**
 * Format date for form inputs (YYYY-MM-DD format)
 */
export const formatDateForInput = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).tz(DEFAULT_TIMEZONE).format("YYYY-MM-DD");
};

/**
 * Get today's date formatted for forms
 */
export const getTodayForInput = (): string => {
  return dayjs().tz(DEFAULT_TIMEZONE).format("YYYY-MM-DD");
};

/**
 * Format datetime with Polish localization
 */
export const formatDateTime = (date: string | Date | dayjs.Dayjs, format: "short" | "medium" | "full" = "medium"): string => {
  const dateObj = dayjs(date).tz(DEFAULT_TIMEZONE);

  switch (format) {
    case "short":
      return dateObj.format("DD.MM.YYYY HH:mm");
    case "medium":
      return dateObj.format("DD MMM YYYY, HH:mm");
    case "full":
      return dateObj.format("dddd, D MMMM YYYY [o] HH:mm");
    default:
      return dateObj.format("DD.MM.YYYY HH:mm");
  }
};

/**
 * Parse date from various formats with Polish locale
 */
export const parseDate = (dateString: string, format?: string): dayjs.Dayjs => {
  return format ? dayjs(dateString, format, "pl") : dayjs(dateString, "pl");
};

/**
 * Check if date is valid
 */
export const isValidDate = (date: string | Date | dayjs.Dayjs): boolean => {
  return dayjs(date).isValid();
};

/**
 * Get localized relative time (e.g., "2 dni temu")
 */
export const getRelativeTime = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).tz(DEFAULT_TIMEZONE).fromNow();
};

/**
 * Format date for table display
 */
export const formatDateForTable = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).tz(DEFAULT_TIMEZONE).format("DD.MM.YYYY");
};

/**
 * Get current date timezone-aware
 */
export const getCurrentDate = (): dayjs.Dayjs => {
  return dayjs().tz(DEFAULT_TIMEZONE);
};
