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

interface AggregationState extends IndicatorAggregatedData {
  programToGroupMap: Record<string, string>;
}

type AggregationAction =
  | { type: "ADD_ROW"; category: string; programType: string; displayName: string; action: string; people: number; actionCount: number }
  | { type: "INIT_PROGRAM_GROUPS"; programToGroupMap: Record<string, string> };

function aggregationReducer(state: AggregationState, action: AggregationAction): AggregationState {
  switch (action.type) {
    case "INIT_PROGRAM_GROUPS":
      return { ...state, programToGroupMap: action.programToGroupMap };

    case "ADD_ROW": {
      const { category, programType, displayName, action: actionName, people, actionCount } = action;

      // Initialize nested structures
      if (!state.byCategory[category]) {
        state.byCategory[category] = {};
      }
      if (!state.byCategory[category][programType]) {
        state.byCategory[category][programType] = {};
      }
      if (!state.byCategory[category][programType][displayName]) {
        state.byCategory[category][programType][displayName] = {};
      }
      if (!state.byCategory[category][programType][displayName][actionName]) {
        state.byCategory[category][programType][displayName][actionName] = { people: 0, actionNumber: 0 };
      }

      // Accumulate values
      state.byCategory[category][programType][displayName][actionName].people += people;
      state.byCategory[category][programType][displayName][actionName].actionNumber += actionCount;

      // Update category totals
      if (!state.categoryTotals[category]) {
        state.categoryTotals[category] = { people: 0, actions: 0 };
      }
      state.categoryTotals[category].people += people;
      state.categoryTotals[category].actions += actionCount;

      // Update grand totals
      state.totalPeople += people;
      state.totalActions += actionCount;

      return state;
    }

    default:
      return state;
  }
}

/**
 * Aggregates raw Excel data by indicator categories or groups
 * Groups programs by their main health category OR by custom program groups
 * @param rawData Raw Excel rows
 * @param selectedMonths Optional array of selected month numbers (1-12)
 * @param indicator Optional indicator to use programGroups for custom grouping
 * @returns Aggregated data grouped by main categories or indicator groups
 */
export function aggregateByIndicators(
  rawData: ExcelRow[], 
  selectedMonths?: number[],
  indicator?: { programGroups?: { [groupName: string]: string[] } }
): IndicatorAggregatedData {
  const validData = filterExcelData(rawData);

  const initialState: AggregationState = {
    byCategory: {},
    totalPeople: 0,
    totalActions: 0,
    categoryTotals: {},
    programToGroupMap: {},
  };

  // Initialize program groups mapping
  let state = initialState;
  if (indicator?.programGroups) {
    const programToGroupMap: Record<string, string> = {};
    for (const [groupName, programs] of Object.entries(indicator.programGroups)) {
      for (const programName of programs) {
        programToGroupMap[programName] = groupName;
      }
    }
    state = aggregationReducer(state, { type: "INIT_PROGRAM_GROUPS", programToGroupMap });
  }

  // Process each row
  validData.forEach((row) => {
    const mainCategory = getMainCategoryFromRow(row);
    const dateStr = String(row["Data"]);
    const programType = String(row["Typ programu"] || "").trim();
    const programName = String(row["Nazwa programu"] || "").trim();
    const action = String(row["Działanie"] || "").trim();
    const peopleCount = Number(row["Liczba ludzi"] || 0);
    const actionCount = Number(row["Liczba działań"] || 0);

    // Check month filter
    if (selectedMonths && selectedMonths.length > 0) {
      const month = moment(dateStr, "YYYY-MM-DD").month() + 1;
      if (!selectedMonths.includes(month)) return;
    }

    // Filter by program groups if defined
    if (indicator?.programGroups && !state.programToGroupMap[programName]) {
      return;
    }

    // Use group name if available
    const displayName = state.programToGroupMap[programName] || programName;

    state = aggregationReducer(state, {
      type: "ADD_ROW",
      category: mainCategory,
      programType,
      displayName,
      action,
      people: peopleCount,
      actionCount,
    });
  });

  const { programToGroupMap, ...result } = state;
  return result;
}
