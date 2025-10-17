/**
 * Centralized regex patterns for validation across the application
 * This ensures consistency and makes it easy to maintain and test validation rules
 */

/**
 * Core validation patterns
 */
export const VALIDATION_PATTERNS = {
  /** Email regex - allows common email formats */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Phone number regex - international format support (+ prefix optional, min 7 digits) */
  phone: /^[\+]?[1-9][\d]{6,15}$/,

  /** Polish postal code format - must be XX-XXX */
  postalCode: /^\d{2}-\d{3}$/,

  /** Polish NIP (TAX ID) - must be exactly 10 digits */
  nip: /^\d{10}$/,

  /** Polish REGON (Business ID) - 9 or 14 digits */
  regon: /^\d{9}$|^\d{14}$/,

  /** URL regex - validates HTTP/HTTPS URLs */
  url: /^https?:\/\/.+/,

  /** Alphanumeric only - no special characters */
  alphanumeric: /^[a-zA-Z0-9]+$/,

  /** Alphanumeric with spaces and hyphens */
  alphanumericExtended: /^[a-zA-Z0-9\s-]+$/,

  /** Numeric only */
  numeric: /^\d+$/,

  /** Polish phone number - starts with +48 or 0 */
  polishPhone: /^(?:\+48|0)[1-9]\d{8}$/,

  /** ISO date format (YYYY-MM-DD) */
  isoDate: /^\d{4}-\d{2}-\d{2}$/,

  /** Time format (HH:MM or HH:MM:SS) */
  time: /^([0-1][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/,

  /** URL slug - lowercase alphanumeric with hyphens */
  urlSlug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  /** Strong password - at least 8 chars, uppercase, lowercase, number */
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  /** UUID format (any version) */
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,

  /** Filename with extension - no double dots */
  filename: /^[\w\-. ]+\.\w{2,5}$^(?!.*\.\.)/,

  /** Case number format (numbers, slashes, year) */
  caseNumber: /^\d+\/\d+\/\d{4}$/,
} as const;

/**
 * Test a value against a pattern
 * @param value The value to test
 * @param pattern The regex pattern to use
 * @returns True if the value matches the pattern
 */
export const testPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

/**
 * Validate email format
 * @param email The email to validate
 * @returns True if email is valid
 */
export const validateEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.email.test(email);
};

/**
 * Validate phone number (international format)
 * @param phone The phone number to validate
 * @returns True if phone is valid
 */
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s/g, "");
  // After removing spaces, should not start with +0 
  if (cleanPhone.startsWith("+0")) {
    return false;
  }
  // Also reject if starts with +48 followed by 0
  if (cleanPhone.startsWith("+480")) {
    return false;
  }
  return VALIDATION_PATTERNS.phone.test(cleanPhone);
};

/**
 * Validate Polish phone number specifically
 * @param phone The phone number to validate (format: +48123456789 or 0123456789)
 * @returns True if phone is a valid Polish number
 */
export const validatePolishPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s/g, "");
  return VALIDATION_PATTERNS.polishPhone.test(cleanPhone);
};

/**
 * Validate postal code format (Polish: XX-XXX)
 * @param postalCode The postal code to validate
 * @returns True if postal code format is valid
 */
export const validatePostalCode = (postalCode: string): boolean => {
  return VALIDATION_PATTERNS.postalCode.test(postalCode);
};

/**
 * Validate URL format
 * @param url The URL to validate
 * @returns True if URL is valid
 */
export const validateUrl = (url: string): boolean => {
  return VALIDATION_PATTERNS.url.test(url);
};

/**
 * Validate ISO date format (YYYY-MM-DD)
 * @param date The date string to validate
 * @returns True if date format is valid
 */
export const validateIsoDate = (date: string): boolean => {
  if (!VALIDATION_PATTERNS.isoDate.test(date)) {
    return false;
  }
  // Additional check: ensure it's a valid date
  const [year, month, day] = date.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

/**
 * Validate time format (HH:MM or HH:MM:SS)
 * @param time The time string to validate
 * @returns True if time format is valid
 */
export const validateTime = (time: string): boolean => {
  return VALIDATION_PATTERNS.time.test(time);
};

/**
 * Validate URL slug format
 * @param slug The slug to validate
 * @returns True if slug format is valid
 */
export const validateUrlSlug = (slug: string): boolean => {
  return VALIDATION_PATTERNS.urlSlug.test(slug);
};

/**
 * Validate strong password
 * Requirements: at least 8 characters, uppercase, lowercase, number
 * @param password The password to validate
 * @returns True if password is strong
 */
export const validateStrongPassword = (password: string): boolean => {
  return VALIDATION_PATTERNS.strongPassword.test(password);
};

/**
 * Validate UUID v4 format
 * @param uuid The UUID string to validate
 * @returns True if UUID format is valid
 */
export const validateUuid = (uuid: string): boolean => {
  return VALIDATION_PATTERNS.uuid.test(uuid);
};

/**
 * Validate filename with extension
 * @param filename The filename to validate
 * @returns True if filename format is valid
 */
export const validateFilename = (filename: string): boolean => {
  // Must have at least one extension and no double dots
  if (filename.includes("..")) {
    return false;
  }
  // Must start with a word character and have a valid extension
  return /^[\w\-. ]+\.\w{2,5}$/.test(filename);
};
