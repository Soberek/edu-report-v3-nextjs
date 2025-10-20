/**
 * Main Category Mapping for Programs
 * Maps program names to their health categories using PROGRAM_CATEGORY_MAPPING from indicatorsConfig
 */

import { PROGRAM_CATEGORY_MAPPING, MAIN_CATEGORIES, type MainCategory } from "./indicatorsConfig";

/**
 * Normalizes program names to handle common encoding issues
 * Replaces em-dashes, non-breaking spaces, etc. with standard characters
 * @param name The program name to normalize
 * @returns Normalized program name
 */
export function normalizeProgramName(name: string): string {
  return (
    name
      // Replace em-dash (–) with hyphen (-)
      .replace(/–/g, "-")
      // Replace various types of spaces with regular space
      .replace(/\u00A0/g, " ") // Non-breaking space
      .replace(/\u2000/g, " ") // En quad
      .replace(/\u2001/g, " ") // Em quad
      .replace(/\u2002/g, " ") // En space
      .replace(/\u2003/g, " ") // Em space
      .replace(/\u2004/g, " ") // Three-per-em space
      .replace(/\u2005/g, " ") // Four-per-em space
      .replace(/\u2006/g, " ") // Six-per-em space
      .replace(/\u2007/g, " ") // Figure space
      .replace(/\u2008/g, " ") // Punctuation space
      .replace(/\u2009/g, " ") // Thin space
      .replace(/\u200A/g, " ") // Hair space
      .replace(/\u202F/g, " ") // Narrow no-break space
      .replace(/\u205F/g, " ") // Medium mathematical space
      // Normalize multiple spaces to single space
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Gets the main category from Excel row data
 * Uses PROGRAM_CATEGORY_MAPPING to look up the program name
 */
export function getMainCategoryFromRow(row: Record<string, unknown>): MainCategory {
  const programName = normalizeProgramName((row as Record<string, string>)["Nazwa programu"] || "");

  // Try to find the category in the mapping
  const category = PROGRAM_CATEGORY_MAPPING[programName];

  // If found, return it, otherwise default to "Inne"
  return category || MAIN_CATEGORIES.INNE;
}

/**
 * Gets all unique main categories
 */
export function getAllMainCategories(): MainCategory[] {
  return Object.values(MAIN_CATEGORIES);
}

// Re-export from indicatorsConfig for convenience
export { MAIN_CATEGORIES, type MainCategory };
export type { ProgramType, ActionType } from "./indicatorsConfig";
export { PROGRAM_TYPES, ACTION_TYPES } from "./indicatorsConfig";
