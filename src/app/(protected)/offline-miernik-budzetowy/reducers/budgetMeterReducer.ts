import type { BudgetMeterState, BudgetMeterAction } from "../types";

export const initialBudgetMeterState: BudgetMeterState = {
  // File handling
  fileName: "",
  rawData: [],
  isLoading: false,
  fileError: null,

  // Month selection
  selectedMonths: Array.from({ length: 12 }, (_, index) => ({
    monthNumber: index + 1,
    selected: false,
  })),
  monthError: null,

  // Data processing
  aggregatedData: null,
  processingError: null,

  // UI state
  isProcessing: false,
};

export const budgetMeterReducer = (state: BudgetMeterState, action: BudgetMeterAction): BudgetMeterState => {
  console.log("action", action);
  switch (action.type) {
    case "RESET_STATE":
      return initialBudgetMeterState;

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
        fileError: action.payload ? null : state.fileError,
      };

    case "SET_FILE_ERROR":
      return {
        ...state,
        fileError: action.payload,
        isLoading: false,
      };

    case "SET_MONTH_ERROR":
      return {
        ...state,
        monthError: action.payload,
      };

    case "SET_PROCESSING_ERROR":
      return {
        ...state,
        processingError: action.payload,
        isProcessing: false,
      };

    case "SET_FILE_DATA":
      return {
        ...state,
        fileName: action.payload.fileName,
        rawData: action.payload.rawData,
        isLoading: false,
        fileError: null,
        // Clear previous aggregated data when new file is loaded
        aggregatedData: null,
        processingError: null,
      };

    case "SET_SELECTED_MONTHS":
      return {
        ...state,
        selectedMonths: action.payload,
        monthError: null,
        // Clear previous aggregated data when months change
        aggregatedData: null,
        processingError: null,
      };

    case "TOGGLE_MONTH":
      if (state.monthError) {
        return state; // Don't allow changes when there's an error
      }

      return {
        ...state,
        selectedMonths: state.selectedMonths.map((month) =>
          month.monthNumber === action.payload ? { ...month, selected: !month.selected } : month
        ),
        monthError: null,
        // Clear previous aggregated data when months change
        aggregatedData: null,
        processingError: null,
      };

    case "SET_AGGREGATED_DATA":
      return {
        ...state,
        aggregatedData: action.payload,
        isProcessing: false,
        processingError: null,
      };

    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.payload,
        processingError: action.payload ? null : state.processingError,
      };

    default:
      return state;
  }
};
