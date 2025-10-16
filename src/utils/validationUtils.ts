/**
 * Email validation regex pattern
 * Matches: basic-email@domain.com format
 * @deprecated Use validators from @/lib/validations/patterns instead for more robust validation
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex pattern
 * Matches: international format with optional + prefix
 * @deprecated Use validators from @/lib/validations/patterns instead
 */
export const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * Polish postal code regex pattern
 * Matches: XX-XXX format (2 digits, dash, 3 digits)
 */
export const postalCodeRegex = /^\d{2}-\d{3}$/;

/**
 * Polish NIP (Numer Identyfikacji Podatkowej) regex pattern
 * Matches: exactly 10 digits
 */
export const nipRegex = /^\d{10}$/;

/**
 * Polish REGON (Rejestr Gospodarki Narodowej) regex pattern
 * Matches: 9 or 14 digits
 */
export const regonRegex = /^\d{9}$|^\d{14}$/;

/**
 * Validate email address format
 * @param email The email address to validate
 * @returns True if email format is valid, false otherwise
 * @example
 * validateEmail("user@example.com") // true
 * validateEmail("invalid@") // false
 * @deprecated Use validators from @/lib/validations/patterns#validateEmail instead
 */
export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

/**
 * Validate phone number format (international format)
 * @param phone The phone number to validate
 * @returns True if phone number format is valid, false otherwise
 * @example
 * validatePhone("+48 123 456 789") // true
 * validatePhone("123456789") // true
 * @deprecated Use validators from @/lib/validations/patterns#validatePhone instead
 */
export const validatePhone = (phone: string): boolean => {
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validate Polish postal code format (XX-XXX)
 * @param postalCode The postal code to validate
 * @returns True if postal code format is valid, false otherwise
 * @example
 * validatePostalCode("00-001") // true
 * validatePostalCode("0001") // false
 */
export const validatePostalCode = (postalCode: string): boolean => {
  return postalCodeRegex.test(postalCode);
};

/**
 * Validate Polish NIP (Numer Identyfikacji Podatkowej) number
 * Includes checksum validation using weights [6, 5, 7, 2, 3, 4, 5, 6, 7]
 * @param nip The NIP number to validate
 * @returns True if NIP is valid (correct format and checksum), false otherwise
 * @example
 * validateNIP("1234567890") // validates format and checksum
 */
export const validateNIP = (nip: string): boolean => {
  const cleanNip = nip.replace(/\D/g, "");
  if (!nipRegex.test(cleanNip)) return false;

  // NIP checksum validation
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanNip[i]) * weights[i];
  }

  const checkDigit = sum % 11;
  return checkDigit === parseInt(cleanNip[9]);
};

/**
 * Validate Polish REGON (Rejestr Gospodarki Narodowej) number
 * @param regon The REGON number to validate (9 or 14 digits)
 * @returns True if REGON format is valid, false otherwise
 * @example
 * validateREGON("123456789") // true (9 digits)
 * validateREGON("12345678901234") // true (14 digits)
 */
export const validateREGON = (regon: string): boolean => {
  const cleanRegon = regon.replace(/\D/g, "");
  return regonRegex.test(cleanRegon);
};

/**
 * Validate that a value is not empty
 * @param value The value to validate (string, array, or any value)
 * @returns True if value is not empty, false otherwise
 * @example
 * validateRequired("") // false
 * validateRequired("text") // true
 * validateRequired([]) // false
 * validateRequired([1, 2, 3]) // true
 */
export const validateRequired = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate that a string meets minimum length requirement
 * @param value The string to validate
 * @param minLength Minimum required length
 * @returns True if string length >= minLength, false otherwise
 * @example
 * validateMinLength("hello", 3) // true
 * validateMinLength("hi", 3) // false
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validate that a string does not exceed maximum length
 * @param value The string to validate
 * @param maxLength Maximum allowed length
 * @returns True if string length <= maxLength, false otherwise
 * @example
 * validateMaxLength("hello", 10) // true
 * validateMaxLength("hello world", 5) // false
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validate that a number is within a range (inclusive)
 * @param value The number to validate
 * @param min Minimum allowed value (inclusive)
 * @param max Maximum allowed value (inclusive)
 * @returns True if value is within [min, max], false otherwise
 * @example
 * validateRange(5, 1, 10) // true
 * validateRange(0, 1, 10) // false
 */
export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate URL format using URL constructor
 * @param url The URL string to validate
 * @returns True if URL is valid, false otherwise
 * @example
 * validateUrl("https://example.com") // true
 * validateUrl("invalid://url") // false
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize string by trimming whitespace and collapsing multiple spaces
 * @param str The string to sanitize
 * @returns Cleaned string with single spaces between words
 * @example
 * sanitizeString("  hello   world  ") // "hello world"
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};

/**
 * Format Polish phone number (9 digits) to XXX XXX XXX format
 * @param phone The phone number to format
 * @returns Formatted phone number or original if not 9 digits
 * @example
 * formatPhoneNumber("123456789") // "123 456 789"
 * formatPhoneNumber("12345") // "12345" (unchanged if not 9 digits)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Format Polish postal code to XX-XXX format
 * @param postalCode The postal code to format
 * @returns Formatted postal code (XX-XXX) or original if not 5 digits
 * @example
 * formatPostalCode("00001") // "00-001"
 * formatPostalCode("123") // "123" (unchanged if not 5 digits)
 */
export const formatPostalCode = (postalCode: string): string => {
  const cleaned = postalCode.replace(/\D/g, "");
  if (cleaned.length === 5) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  }
  return postalCode;
};