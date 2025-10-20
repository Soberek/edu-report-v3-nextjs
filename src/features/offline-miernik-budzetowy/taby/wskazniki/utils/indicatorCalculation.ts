/**
 * Indicators Calculation Engine
 * Uses indicatorsConfig to calculate indicator values from aggregated data
 */

import type { ExcelRow } from "../../../types";
import type { IndicatorDefinition, MainCategory } from "./indicatorsConfig";
import { getAllIndicators } from "./indicatorsConfig";
import { getMainCategoryFromRow } from "./mainCategoryMapping";
import { isNonProgramVisit } from "../../../utils/dataFiltering";

/**
 * Indicator calculation result
 */
export interface IndicatorResult {
  indicatorId: string;
  indicatorName: string;
  totalPeople: number;
  totalActions: number;
  rowsProcessed: number;
}

/**
 * Calculates a single indicator from raw Excel data
 * @param data Raw Excel rows
 * @param indicator Indicator definition to calculate
 * @returns Indicator result with totals
 */
export function calculateIndicator(data: ExcelRow[], indicator: IndicatorDefinition): IndicatorResult {
  let totalPeople = 0;
  let totalActions = 0;
  let rowsProcessed = 0;

  data.forEach((row) => {
    const mainCategory = getMainCategoryFromRow(row);
    const programType = String(row["Typ programu"] || "").trim();
    const programName = String(row["Nazwa programu"] || "").trim();
    const isNonProgram = isNonProgramVisit(row);

    // Check if this row matches the indicator's criteria
    // Can match by specificPrograms or by mainCategories
    let matches = false;

    if (indicator.specificPrograms && indicator.specificPrograms.length > 0) {
      // If specific programs are defined, check against those
      matches = indicator.specificPrograms.includes(programName);
    } else if (indicator.mainCategories && indicator.mainCategories.length > 0) {
      // Otherwise check main categories
      matches = indicator.mainCategories.includes(mainCategory as MainCategory);
    }

    if (!matches) {
      return; // Skip if doesn't match
    }

    // Check non-program inclusion setting
    if (isNonProgram && !indicator.includeNonProgram) {
      return; // Skip non-program if not included in indicator
    }

    // Check program type filters if specified
    if (indicator.programTypes) {
      if (indicator.programTypes.include && !indicator.programTypes.include.includes(programType)) {
        return;
      }
      if (indicator.programTypes.exclude && indicator.programTypes.exclude.includes(programType)) {
        return;
      }
    }

    // Add this row's data to the indicator
    const people = Number(row["Liczba ludzi"] || 0);
    const actions = Number(row["Liczba działań"] || 0);

    totalPeople += people;
    totalActions += actions;
    rowsProcessed++;
  });

  return {
    indicatorId: indicator.id,
    indicatorName: indicator.name,
    totalPeople,
    totalActions,
    rowsProcessed,
  };
}

/**
 * Calculates multiple indicators at once
 * @param data Raw Excel rows
 * @param indicators Array of indicator definitions to calculate
 * @returns Array of indicator results
 */
export function calculateIndicators(data: ExcelRow[], indicators: IndicatorDefinition[]): IndicatorResult[] {
  return indicators.map((indicator) => calculateIndicator(data, indicator));
}

/**
 * Calculates all indicators at once
 * @param data Raw Excel rows
 * @returns Map of indicator ID to result
 */
export function calculateAllIndicators(data: ExcelRow[]): Map<string, IndicatorResult> {
  const allIndicators = getAllIndicators();
  const results = calculateIndicators(data, allIndicators);

  const resultsMap = new Map<string, IndicatorResult>();
  results.forEach((result) => {
    resultsMap.set(result.indicatorId, result);
  });

  return resultsMap;
}
