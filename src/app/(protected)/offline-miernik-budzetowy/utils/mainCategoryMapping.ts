/**
 * Main Category Mapping for Programs
 * Works with "Main Category" key from raw Excel data
 */

export const MAIN_CATEGORIES = {
  OTYLOSC: "Zapobieganie otyłości",
  SZCZEPIENIA: "Szczepienia",
  UZALEZNIENIA: "Profilaktyka uzależnień",
  HIV_AIDS: "HIV/AIDS",
  INNE: "Inne",
} as const;

export type MainCategory = (typeof MAIN_CATEGORIES)[keyof typeof MAIN_CATEGORIES];

/**
 * Normalizes the main category value from Excel data
 * Handles different variations and typos
 */
export function normalizeMainCategory(category: string | undefined | null): MainCategory {
  // Handle null, undefined, or non-string values
  if (!category || typeof category !== "string") {
    return MAIN_CATEGORIES.INNE;
  }

  const normalized = category.trim().toLowerCase();

  // Match against known categories
  if (normalized.includes("otyłoś") || normalized.includes("otylos")) {
    return MAIN_CATEGORIES.OTYLOSC;
  }
  if (normalized.includes("szczepien")) {
    return MAIN_CATEGORIES.SZCZEPIENIA;
  }
  if (normalized.includes("uzależnień") || normalized.includes("uzależnien") || normalized.includes("uzaleznien")) {
    return MAIN_CATEGORIES.UZALEZNIENIA;
  }
  if (normalized.includes("hiv") || normalized.includes("aids")) {
    return MAIN_CATEGORIES.HIV_AIDS;
  }

  // Default to "Inne"
  return MAIN_CATEGORIES.INNE;
}

/**
 * Gets the main category from Excel row data
 * Reads the "Main Category" key from the row
 */
export function getMainCategoryFromRow(row: Record<string, unknown>): MainCategory {
  const categoryValue =
    (row as Record<string, string>)["Main Category"] ||
    (row as Record<string, string>)["Kategoria główna"] ||
    (row as Record<string, string>)["main category"];
  return normalizeMainCategory(categoryValue as string);
}

/**
 * Gets all unique main categories
 */
export function getAllMainCategories(): MainCategory[] {
  return Object.values(MAIN_CATEGORIES);
}
