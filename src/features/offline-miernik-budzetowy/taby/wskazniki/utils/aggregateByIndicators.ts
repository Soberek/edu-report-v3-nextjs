/**
 * Aggregates Excel data by indicator categories
 * Groups data by main health categories (Szczepienia, Zapobieganie otyłości, etc)
 */

import moment from "moment";
import type { ExcelRow, ProgramsData } from "../../../types";
import { getMainCategoryFromRow } from "./mainCategoryMapping";
import { filterExcelData } from "../../../utils/dataFiltering";

export interface IndicatorCategoryData {
  [mainCategory: string]: ProgramsData;
}

export interface IndicatorAggregatedData {
  byCategory: IndicatorCategoryData;
  totalPeople: number;
  totalActions: number;
  categoryTotals: Record<string, { people: number; actions: number }>;
}

/**
 * Aggregates raw Excel data by indicator categories
 * Groups programs by their main health category
 * @param rawData Raw Excel rows
 * @param selectedMonths Optional array of selected month numbers (1-12)
 * @returns Aggregated data grouped by main categories
 */
export function aggregateByIndicators(rawData: ExcelRow[], selectedMonths?: number[]): IndicatorAggregatedData {
  // Filter data first
  const validData = filterExcelData(rawData);

  const byCategory: IndicatorCategoryData = {};
  let totalPeople = 0;
  let totalActions = 0;
  const categoryTotals: Record<string, { people: number; actions: number }> = {};

  validData.forEach((row) => {
    const mainCategory = getMainCategoryFromRow(row);
    const dateStr = String(row["Data"]);
    const programType = String(row["Typ programu"] || "").trim();
    const programName = String(row["Nazwa programu"] || "").trim();
    const action = String(row["Działanie"] || "").trim();
    const peopleCount = Number(row["Liczba ludzi"] || 0);
    const actionCount = Number(row["Liczba działań"] || 0);

    // Check month filter if specified
    if (selectedMonths && selectedMonths.length > 0) {
      const month = moment(dateStr, "YYYY-MM-DD").month() + 1;
      if (!selectedMonths.includes(month)) {
        return;
      }
    }

    // Initialize category if not exists
    if (!byCategory[mainCategory]) {
      byCategory[mainCategory] = {};
    }

    // Initialize program type if not exists
    if (!byCategory[mainCategory][programType]) {
      byCategory[mainCategory][programType] = {};
    }

    // Initialize program name if not exists
    if (!byCategory[mainCategory][programType][programName]) {
      byCategory[mainCategory][programType][programName] = {};
    }

    // Initialize action if not exists
    if (!byCategory[mainCategory][programType][programName][action]) {
      byCategory[mainCategory][programType][programName][action] = { people: 0, actionNumber: 0 };
    }

    // Accumulate values
    byCategory[mainCategory][programType][programName][action].people += peopleCount;
    byCategory[mainCategory][programType][programName][action].actionNumber += actionCount;

    // Track category totals
    if (!categoryTotals[mainCategory]) {
      categoryTotals[mainCategory] = { people: 0, actions: 0 };
    }
    categoryTotals[mainCategory].people += peopleCount;
    categoryTotals[mainCategory].actions += actionCount;

    // Track grand totals
    totalPeople += peopleCount;
    totalActions += actionCount;
  });

  return {
    byCategory,
    totalPeople,
    totalActions,
    categoryTotals,
  };
}
