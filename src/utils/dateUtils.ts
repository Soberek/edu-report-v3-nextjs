/**
 * Format date with Polish localization
 * @param date The date to format (Date object or string)
 * @param options Optional Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string in Polish locale
 * @example
 * formatDate(new Date()) // "15 października 2024"
 * formatDate("2024-10-15") // "15 października 2024"
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return dateObj.toLocaleDateString("pl-PL", { ...defaultOptions, ...options });
};

/**
 * Format date and time with Polish localization
 * @param date The date to format (Date object or string)
 * @returns Formatted datetime string (e.g., "15 października 2024, 14:30")
 * @example
 * formatDateTime(new Date()) // "15 października 2024, 14:30"
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format time only with Polish localization
 * @param date The date to format (Date object or string)
 * @returns Formatted time string (e.g., "14:30")
 * @example
 * formatTime(new Date()) // "14:30"
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Check if a date is today
 * @param date The date to check
 * @returns True if the date is today, false otherwise
 * @example
 * isToday(new Date()) // true
 * isToday("2024-10-15") // true or false depending on current date
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  return dateObj.getDate() === today.getDate() && dateObj.getMonth() === today.getMonth() && dateObj.getFullYear() === today.getFullYear();
};

/**
 * Check if a date is yesterday
 * @param date The date to check
 * @returns True if the date is yesterday, false otherwise
 * @example
 * isYesterday(new Date(Date.now() - 86400000)) // true
 */
export const isYesterday = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get relative time string (e.g., "2 dni temu")
 * @param date The date to convert
 * @returns Relative time string in Polish
 * @example
 * getRelativeTime(new Date(Date.now() - 3600000)) // "1 godz. temu"
 * getRelativeTime(new Date(Date.now() - 300000)) // "5 min temu"
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "przed chwilą";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min temu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} godz. temu`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} dni temu`;
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Add days to a date
 * @param date The base date
 * @param days Number of days to add (can be negative)
 * @returns New date with days added
 * @example
 * addDays(new Date(), 5) // Date 5 days from now
 * addDays("2024-10-15", -3) // 3 days before October 15
 */
export const addDays = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add months to a date
 * @param date The base date
 * @param months Number of months to add (can be negative)
 * @returns New date with months added
 * @example
 * addMonths(new Date(), 3) // Date 3 months from now
 * addMonths("2024-10-15", -1) // September 15, 2024
 */
export const addMonths = (date: Date | string, months: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Add years to a date
 * @param date The base date
 * @param years Number of years to add (can be negative)
 * @returns New date with years added
 * @example
 * addYears(new Date(), 1) // Date 1 year from now
 * addYears("2024-10-15", -2) // October 15, 2022
 */
export const addYears = (date: Date | string, years: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setFullYear(result.getFullYear() + years);
  return result;
};