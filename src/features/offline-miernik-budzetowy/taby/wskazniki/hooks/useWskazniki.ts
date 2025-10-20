import { useReducer, useCallback, useMemo } from "react";
import moment from "moment";
import type { ExcelRow, Month } from "../../../types";
import { filterExcelData } from "../../../utils/dataFiltering";
import { getMainCategoryFromRow } from "../utils/mainCategoryMapping";
import { getIndicatorById } from "../utils/indicatorsConfig";
import type { IndicatorAggregatedData } from "../utils/aggregateByIndicators";

interface WskaznikiState extends IndicatorAggregatedData {
  programToGroupMap: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

type WskaznikiAction =
  | { type: "ADD_ROW"; category: string; programType: string; displayName: string; action: string; people: number; actionCount: number }
  | { type: "INIT_PROGRAM_GROUPS"; programToGroupMap: Record<string, string> }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

const initialState: WskaznikiState = {
  byCategory: {},
  totalPeople: 0,
  totalActions: 0,
  categoryTotals: {},
  programToGroupMap: {},
  isLoading: false,
  error: null,
};

function wskaznikiReducer(state: WskaznikiState, action: WskaznikiAction): WskaznikiState {
  switch (action.type) {
    case "RESET":
      return { ...initialState };

    case "SET_LOADING":
      return { ...state, isLoading: action.loading };

    case "SET_ERROR":
      return { ...state, error: action.error };

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

interface UseWskaznikiOptions {
  indicatorId?: string;
  rawData: ExcelRow[];
  selectedMonths: Month[];
}

export type { UseWskaznikiOptions };

/**
 * Custom hook for managing indicators aggregation logic
 * Handles data processing, grouping, and state management with useReducer
 */
export function useWskazniki({ indicatorId = "palenie_tytoniu", rawData, selectedMonths }: UseWskaznikiOptions) {
  const [state, dispatch] = useReducer(wskaznikiReducer, initialState);

  // Memoize selected month numbers
  const selectedMonthNumbers = useMemo(() => {
    return selectedMonths.filter((m) => m.selected).map((m) => m.monthNumber);
  }, [selectedMonths]);

  // Memoize indicator
  const indicator = useMemo(() => {
    return getIndicatorById(indicatorId);
  }, [indicatorId]);

  // Process data
  const processData = useCallback(() => {
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "RESET" });

      const validData = filterExcelData(rawData);

      // Initialize program groups mapping
      if (indicator?.programGroups) {
        const programToGroupMap: Record<string, string> = {};
        for (const [groupName, programs] of Object.entries(indicator.programGroups)) {
          for (const programName of programs) {
            programToGroupMap[programName] = groupName;
          }
        }
        dispatch({ type: "INIT_PROGRAM_GROUPS", programToGroupMap });
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
        if (selectedMonthNumbers && selectedMonthNumbers.length > 0) {
          const month = moment(dateStr, "YYYY-MM-DD").month() + 1;
          if (!selectedMonthNumbers.includes(month)) return;
        }

        // Filter by program groups if defined
        if (indicator?.programGroups && !state.programToGroupMap[programName]) {
          return;
        }

        // Use group name if available
        const displayName = state.programToGroupMap[programName] || programName;

        dispatch({
          type: "ADD_ROW",
          category: mainCategory,
          programType,
          displayName,
          action,
          people: peopleCount,
          actionCount,
        });
      });

      dispatch({ type: "SET_LOADING", loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      dispatch({ type: "SET_ERROR", error: errorMessage });
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, [rawData, selectedMonthNumbers, indicator, state.programToGroupMap]);

  // Auto-process when dependencies change
  useMemo(() => {
    processData();
  }, [processData]);

  return {
    state,
    hasData: Object.keys(state.byCategory).length > 0,
    isLoading: state.isLoading,
    error: state.error,
  };
}
