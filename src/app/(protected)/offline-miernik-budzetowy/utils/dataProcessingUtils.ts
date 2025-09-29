/**
 * Data processing utilities for budget meter
 * Pure functions for data transformation and validation
 */

import type { ExcelRow, Month, AggregatedData } from "../types";

/**
 * Checks if data processing conditions are met
 */
export const canProcessData = (rawData: ExcelRow[], selectedMonths: Month[], existingData: AggregatedData | null): boolean => {
  const hasRawData = rawData.length > 0;
  const hasSelectedMonths = selectedMonths.some((month) => month.selected);
  const noExistingData = !existingData;

  return hasRawData && hasSelectedMonths && noExistingData;
};

/**
 * Counts selected months
 */
export const getSelectedMonthsCount = (months: Month[]): number => {
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
 */
export const getCurrentError = (fileError: string | null, monthError: string | null, processingError: string | null): string | null => {
  return fileError || monthError || processingError;
};
