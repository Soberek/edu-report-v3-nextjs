/**
 * Aggregates Excel data by indicator categories
 * Groups data by main health categories (Szczepienia, Zapobieganie otyłości, etc)
 */

import moment from "moment";
import type { ExcelRow, ProgramsData } from "../../../types";
import { getMainCategoryFromRow } from "./mainCategoryMapping";
import { filterExcelData, isNonProgramVisitWithWizytacja } from "../../../utils/dataFiltering";
import { getIndicatorById, getAllIndicators } from "./indicatorsConfig";

export interface IndicatorCategoryData {
  [mainCategory: string]: ProgramsData;
}

export interface IndicatorAggregatedData {
  byCategory: IndicatorCategoryData;
  totalPeople: number;
  totalActions: number;
  categoryTotals: Record<string, { people: number; actions: number }>;
  groupDefinitions: Record<string, string[]>;
}

export interface AggregateOptions {
  indicatorId?: string;
  useAllGroupings?: boolean;
}

/**
 * Aggregates raw Excel data by indicator categories or groups.
 * This is a pure function that handles all core aggregation logic.
 *
 * @param rawData Raw Excel rows.
 * @param selectedMonths Optional array of selected month numbers (1-12).
 * @param options Aggregation options including indicatorId or useAllGroupings.
 * @returns Aggregated data grouped by main categories or indicator groups.
 */
export function aggregateByIndicators(
  rawData: ExcelRow[],
  selectedMonths?: number[],
  options: AggregateOptions = {}
): IndicatorAggregatedData {
  const { indicatorId, useAllGroupings } = options;
  const validData = filterExcelData(rawData);

  const result: IndicatorAggregatedData = {
    byCategory: {},
    totalPeople: 0,
    totalActions: 0,
    categoryTotals: {},
    groupDefinitions: {},
  };

  // Determine which groupings to use based on options
  const indicator = indicatorId ? getIndicatorById(indicatorId) : undefined;
  let groupingsToUse: Record<string, string[]> | undefined = indicator?.programGroups;

  if (useAllGroupings) {
    const allIndicators = getAllIndicators();
    const combined: Record<string, string[]> = {};
    for (const ind of allIndicators) {
      if (ind.programGroups) {
        Object.assign(combined, ind.programGroups);
      }
    }
    groupingsToUse = Object.keys(combined).length > 0 ? combined : undefined;
  }
  
  if (groupingsToUse) {
    result.groupDefinitions = groupingsToUse;
  }

  // Process each row
  validData.forEach((row) => {
    const dateStr = String(row["Data"]);

    // Filter by month
    if (selectedMonths && selectedMonths.length > 0) {
      const month = moment(dateStr, "YYYY-MM-DD").month() + 1;
      if (!selectedMonths.includes(month)) return;
    }

    // Skip NIEPROGRAMOWE + wizytacja rows (business rule: these should be excluded from indicators)
    if (isNonProgramVisitWithWizytacja(row)) {
      return;
    }

    const mainCategory = getMainCategoryFromRow(row);
    const programType = String(row["Typ programu"] || "").trim();
    const programName = String(row["Nazwa programu"] || "").trim();
    const action = String(row["Działanie"] || "").trim();
    const peopleCount = Number(row["Liczba ludzi"] || 0);
    const actionCount = Number(row["Liczba działań"] || 0);

    // Determine the display name (group name or program name)
    let displayName = programName;
    if (groupingsToUse) {
      for (const [groupName, programs] of Object.entries(groupingsToUse)) {
        if (programs.includes(programName)) {
          displayName = groupName;
          break;
        }
      }
    }

    // Accumulate data by mutating the local 'result' object.
    // This is safe as 'result' is scoped to this function.
    if (!result.byCategory[mainCategory]) result.byCategory[mainCategory] = {};
    if (!result.byCategory[mainCategory][programType]) result.byCategory[mainCategory][programType] = {};
    if (!result.byCategory[mainCategory][programType][displayName]) result.byCategory[mainCategory][programType][displayName] = {};
    if (!result.byCategory[mainCategory][programType][displayName][action]) {
      result.byCategory[mainCategory][programType][displayName][action] = { people: 0, actionNumber: 0 };
    }
    result.byCategory[mainCategory][programType][displayName][action].people += peopleCount;
    result.byCategory[mainCategory][programType][displayName][action].actionNumber += actionCount;

    // Update totals
    if (!result.categoryTotals[mainCategory]) result.categoryTotals[mainCategory] = { people: 0, actions: 0 };
    result.categoryTotals[mainCategory].people += peopleCount;
    result.categoryTotals[mainCategory].actions += actionCount;

    result.totalPeople += peopleCount;
    result.totalActions += actionCount;
  });

  return result;
}