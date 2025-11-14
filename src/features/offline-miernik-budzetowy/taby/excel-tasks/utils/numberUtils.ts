/**
 * Number parsing utilities for IZRZ form
 * Handles type coercion and validation for numeric fields
 */

/**
 * Parse viewer/participant count from various types
 * Handles string, number, null/undefined gracefully
 *
 * @param count - Value to parse (string, number, or other)
 * @returns Parsed non-negative integer, defaults to 0
 */
export function parseViewerCount(count: unknown): number {
  if (typeof count === "number") return count;
  if (typeof count === "string") {
    const parsed = parseInt(count, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}
