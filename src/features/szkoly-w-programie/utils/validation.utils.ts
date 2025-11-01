/**
 * Validation utilities for email, phone, and other common checks
 * Eliminates magic values and provides single source of truth for validation rules
 */

/**
 * Checks if a string is a valid, non-empty email
 * @param email - The email to validate
 * @returns true if email is non-empty and trimmed
 */
export const isValidEmail = (email?: string): email is string =>
  email !== undefined && email.trim().length > 0;

/**
 * Checks if a string is a valid, non-empty phone number
 * @param phone - The phone to validate
 * @returns true if phone is non-empty and trimmed
 */
export const isValidPhone = (phone?: string): phone is string =>
  phone !== undefined && phone.trim().length > 0;

/**
 * Checks if a value is a valid ID (non-empty string)
 * @param id - The ID to validate
 * @returns true if ID is a non-empty string
 */
export const isValidId = (id?: string): id is string =>
  id !== undefined && typeof id === "string" && id.trim().length > 0;

/**
 * Checks if a value is a valid student count (positive number)
 * @param count - The count to validate
 * @returns true if count is a positive number
 */
export const isValidStudentCount = (count?: number): count is number =>
  count !== undefined && typeof count === "number" && count > 0;

/**
 * Trims and normalizes a string for comparison
 * @param str - The string to normalize
 * @returns Trimmed, lowercase string
 */
export const normalizeString = (str?: string): string =>
  (str ?? "").toLowerCase().trim();

/**
 * Deduplicates an array of strings (case-insensitive)
 * @param items - Array of strings to deduplicate
 * @returns Set of deduplicated strings (lowercased)
 */
export const deduplicateStrings = (items?: string[]): Set<string> =>
  new Set((items ?? []).map(normalizeString).filter(Boolean));

/**
 * Filters out invalid items from an array
 * @param items - Array of items with optional values
 * @param validator - Validation function
 * @returns Filtered array of valid items
 */
export const filterValidItems = <T extends { email?: string }>(
  items: T[],
  validator: (item: T) => boolean
): T[] => items.filter(validator);
