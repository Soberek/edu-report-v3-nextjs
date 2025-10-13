/**
 * Data processing utilities for budget meter
 * Pure functions for data transformation and validation
 */

import type { ExcelRow, Month, AggregatedData } from "../types";

/**
 * Checks if data processing conditions are met
 */
export const canProcessData = (
  rawData: ExcelRow[] | null | undefined,
  selectedMonths: Month[] | null | undefined,
  existingData: AggregatedData | null
): boolean => {
  // Handle null/undefined inputs
  if (!rawData || !Array.isArray(rawData)) {
    return false;
  }
  if (!selectedMonths || !Array.isArray(selectedMonths)) {
    return false;
  }

  const hasRawData = rawData.length > 0;
  const hasSelectedMonths = selectedMonths.some((month) => month.selected);
  const noExistingData = !existingData;

  return hasRawData && hasSelectedMonths && noExistingData;
};

/**
 * Counts selected months
 */
export const getSelectedMonthsCount = (months: Month[]): number => {
  if (!months || !Array.isArray(months)) {
    return 0;
  }
  return months.filter((month) => month.selected).length;
};

/**
 * Checks if data export is possible
 */
export const canExportData = (aggregatedData: AggregatedData | null): boolean => {
  return aggregatedData !== null && aggregatedData.aggregated !== null;
};

/**
 * Determines if processing should happen automatically
 */
export const shouldAutoProcess = (
  rawDataLength: number,
  selectedMonthsCount: number,
  existingData: AggregatedData | null,
  autoProcessingEnabled: boolean = true
): boolean => {
  if (!autoProcessingEnabled) {
    return false;
  }

  return rawDataLength > 0 && selectedMonthsCount > 0 && !existingData;
};

/**
 * Gets the first available error from multiple error sources
 * Returns the first non-null/undefined error, or null if all are null/undefined
 * Empty strings are considered valid errors
 */
export const getCurrentError = (
  fileError: string | null | undefined,
  monthError: string | null | undefined,
  processingError: string | null | undefined
): string | null => {
  // Check each error explicitly to handle empty strings correctly
  if (fileError !== null && fileError !== undefined) {
    return fileError;
  }
  if (monthError !== null && monthError !== undefined) {
    return monthError;
  }
  if (processingError !== null && processingError !== undefined) {
    return processingError;
  }
  return null;
};
