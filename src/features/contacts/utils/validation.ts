/**
 * Validation utility functions for contacts
 * Provides validation helpers and error formatting
 */

import { ZodError } from "zod";

/**
 * Format Zod validation error into user-friendly message
 * @param error - Zod validation error
 * @returns Formatted error message
 */
export function formatValidationError(error: ZodError): string {
  const firstIssue = error.issues[0];
  if (!firstIssue) return "Validation failed";

  const fieldName = firstIssue.path.join(".");
  return `${fieldName}: ${firstIssue.message}`;
}

/**
 * Check if email format is valid (basic check)
 * @param email - Email string
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Normalize phone number (basic formatting)
 * @param phone - Phone number string
 * @returns Normalized phone string
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return "";
  // Remove non-digit characters except spaces and hyphens
  return phone.replace(/[^\d\s\-()]/g, "").trim();
}
