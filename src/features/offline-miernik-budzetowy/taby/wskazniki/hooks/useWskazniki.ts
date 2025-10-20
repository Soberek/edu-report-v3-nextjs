import { useReducer, useCallback, useMemo, useEffect } from "react";
import moment from "moment";
import type { ExcelRow, Month } from "../../../types";
import { filterExcelData } from "../../../utils/dataFiltering";
import { getMainCategoryFromRow } from "../utils/mainCategoryMapping";
import { getIndicatorById, getAllIndicators } from "../utils/indicatorsConfig";
import type { IndicatorAggregatedData } from "../utils/aggregateByIndicators";

interface WskaznikiState extends IndicatorAggregatedData {
  programToGroupMap: Record<string, string>;
  groupDefinitions: Record<string, string[]>; // groupName -> array of program names
  isLoading: boolean;
  error: string | null;
}

type WskaznikiAction =
  | { type: "ADD_ROW"; category: string; programType: string; displayName: string; action: string; people: number; actionCount: number }
  | { type: "INIT_PROGRAM_GROUPS"; programToGroupMap: Record<string, string>; groupDefinitions: Record<string, string[]> }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

const initialState: WskaznikiState = {
  byCategory: {},
  totalPeople: 0,
  totalActions: 0,
  categoryTotals: {},
  programToGroupMap: {},
  groupDefinitions: {},
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
      return { ...state, programToGroupMap: action.programToGroupMap, groupDefinitions: action.groupDefinitions };

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
  useAllGroupings?: boolean; // If true, apply ALL programGroups from all indicators
}

export type { UseWskaznikiOptions };

/**
 * Custom hook for managing indicators aggregation logic
 * Handles data processing, grouping, and state management with useReducer
 */
export function useWskazniki({ indicatorId = "palenie_tytoniu", rawData, selectedMonths, useAllGroupings = false }: UseWskaznikiOptions) {
  const [state, dispatch] = useReducer(wskaznikiReducer, initialState);

  // Memoize selected month numbers
  const selectedMonthNumbers = useMemo(() => {
    return selectedMonths.filter((m) => m.selected).map((m) => m.monthNumber);
  }, [selectedMonths]);

  // Memoize indicator(s)
  const indicator = useMemo(() => {
    return getIndicatorById(indicatorId);
  }, [indicatorId]);

  // Collect all programGroups if useAllGroupings is true
  const allGroupings = useMemo(() => {
    if (!useAllGroupings) return undefined;

    const allIndicators = getAllIndicators();
    const combined: Record<string, string[]> = {};

    for (const ind of allIndicators) {
      if (ind.programGroups) {
        Object.assign(combined, ind.programGroups);
      }
    }

    return Object.keys(combined).length > 0 ? combined : undefined;
  }, [useAllGroupings]);

  // Process data
  const processData = useCallback(() => {
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "RESET" });

      const validData = filterExcelData(rawData);

      // Determine which groupings to use
      const groupingsToUse = useAllGroupings ? allGroupings : indicator?.programGroups;

      // Initialize program groups mapping
      if (groupingsToUse) {
        const programToGroupMap: Record<string, string> = {};
        for (const [groupName, programs] of Object.entries(groupingsToUse)) {
          for (const programName of programs) {
            programToGroupMap[programName] = groupName;
          }
        }
        dispatch({ type: "INIT_PROGRAM_GROUPS", programToGroupMap, groupDefinitions: groupingsToUse });
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

        // NOTE: We don't filter here - we show ALL programs, but group the ones that match
        
        // Use group name if available, otherwise use original program name
        let displayName = programName;
        if (groupingsToUse) {
          for (const [groupName, programs] of Object.entries(groupingsToUse)) {
            if (programs.includes(programName)) {
              displayName = groupName;
              break;
            }
          }
        }

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
  }, [rawData, selectedMonthNumbers, indicator, allGroupings, useAllGroupings]);

  // Auto-process when dependencies change
  useEffect(() => {
    processData();
  }, [processData]);

  return {
    state,
    hasData: Object.keys(state.byCategory).length > 0,
    isLoading: state.isLoading,
    error: state.error,
    formatGroupedName: (displayName: string) => {
      const programs = state.groupDefinitions[displayName];
      if (programs && programs.length > 0) {
        return "🔗 Połączone: " + programs.join(", ");
      }
      return displayName;
    },
  };
}
