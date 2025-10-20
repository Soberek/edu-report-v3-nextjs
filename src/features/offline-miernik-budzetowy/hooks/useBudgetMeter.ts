import { useReducer, useCallback, useMemo } from "react";
import { budgetMeterReducer, initialBudgetMeterState } from "../reducers/budgetMeterReducer";
import { validateExcelFile, readExcelFile } from "../utils/fileUtils";
import { validateExcelData, aggregateData, exportToExcel, exportToTemplate, exportToCumulativeTemplate } from "../utils/dataProcessing";
import { ERROR_MESSAGES } from "../constants";

export const useBudgetMeter = () => {
  const [state, dispatch] = useReducer(budgetMeterReducer, initialBudgetMeterState);

  // File handling
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      dispatch({ type: "SET_FILE_ERROR", payload: ERROR_MESSAGES.NO_FILE_SELECTED });
      return;
    }

    const file = files[0];

    // Validate file
    const validation = validateExcelFile(file);
    if (!validation.isValid) {
      dispatch({ type: "SET_FILE_ERROR", payload: validation.error || ERROR_MESSAGES.FILE_INVALID_TYPE });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { fileName, data } = await readExcelFile(file);

      // Validate data
      const dataValidation = validateExcelData(data);
      if (!dataValidation.isValid) {
        dispatch({ type: "SET_FILE_ERROR", payload: dataValidation.error || ERROR_MESSAGES.DATA_NO_CONTENT });
        return;
      }

      dispatch({ type: "SET_FILE_DATA", payload: { fileName, rawData: data } });

      // Keep the existing month selection (default is October)
      // Don't auto-select all months - let user choose which months to analyze
    } catch (error) {
      dispatch({
        type: "SET_FILE_ERROR",
        payload: error instanceof Error ? error.message : ERROR_MESSAGES.DATA_NO_CONTENT,
      });
    }
  }, []);

  // Month selection
  const handleMonthToggle = useCallback(
    (monthNumber: number) => {
      if (state.monthError) {
        return; // Don't allow changes when there's an error
      }

      dispatch({ type: "TOGGLE_MONTH", payload: monthNumber });
    },
    [state.monthError]
  );

  const handleMonthSelectAll = useCallback(() => {
    const allMonthsSelected = state.selectedMonths.map((month) => ({ ...month, selected: true }));
    dispatch({ type: "SET_SELECTED_MONTHS", payload: allMonthsSelected });
  }, [state.selectedMonths]);

  const handleMonthDeselectAll = useCallback(() => {
    const noMonthsSelected = state.selectedMonths.map((month) => ({ ...month, selected: false }));
    dispatch({ type: "SET_SELECTED_MONTHS", payload: noMonthsSelected });
  }, [state.selectedMonths]);

  const handleSelectPreset = useCallback(
    (monthNumbers: number[]) => {
      const presetMonths = state.selectedMonths.map((month) => ({
        ...month,
        selected: monthNumbers.includes(month.monthNumber),
      }));
      
      // Only dispatch if selection actually changed to avoid unnecessary re-renders
      const selectionChanged = presetMonths.some(
        (month, idx) => month.selected !== state.selectedMonths[idx].selected
      );
      
      if (selectionChanged) {
        dispatch({ type: "SET_SELECTED_MONTHS", payload: presetMonths });
      }
    },
    [state.selectedMonths]
  );

  // Data processing
  const processData = useCallback(async () => {
    if (!state.rawData.length || !state.selectedMonths.some((month) => month.selected)) {
      dispatch({ type: "SET_PROCESSING_ERROR", payload: ERROR_MESSAGES.NO_DATA_TO_PROCESS });
      return;
    }

    try {
      dispatch({ type: "SET_PROCESSING", payload: true });

      const aggregatedData = aggregateData(state.rawData, state.selectedMonths);
      dispatch({ type: "SET_AGGREGATED_DATA", payload: aggregatedData });
    } catch (error) {
      dispatch({
        type: "SET_PROCESSING_ERROR",
        payload: error instanceof Error ? error.message : ERROR_MESSAGES.PROCESSING_ERROR,
      });
    }
  }, [state.rawData, state.selectedMonths]);

  // Export functionality
  const handleExportToExcel = useCallback(async (customFileName?: string) => {
    if (!state.aggregatedData) {
      return false;
    }

    try {
      return await exportToExcel(state.aggregatedData, customFileName);
    } catch (error) {
      console.error("Export error:", error);
      return false;
    }
  }, [state.aggregatedData]);

  const handleExportToTemplate = useCallback(async (customFileName?: string) => {
    if (!state.aggregatedData) {
      return false;
    }

    try {
      return await exportToTemplate(state.aggregatedData, customFileName);
    } catch (error) {
      console.error("Export to template error:", error);
      return false;
    }
  }, [state.aggregatedData]);

  const handleExportToCumulativeTemplate = useCallback(async (customFileName?: string) => {
    if (!state.aggregatedData) {
      return false;
    }

    try {
      return await exportToCumulativeTemplate(state.aggregatedData, customFileName);
    } catch (error) {
      console.error("Export to cumulative template error:", error);
      return false;
    }
  }, [state.aggregatedData]);

  // Reset functionality
  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  // Computed values
  const selectedMonthsCount = useMemo(() => state.selectedMonths.filter((month) => month.selected).length, [state.selectedMonths]);

  const hasValidData = useMemo(
    () => state.aggregatedData && Object.keys(state.aggregatedData.aggregated).length > 0,
    [state.aggregatedData]
  );

  const canProcess = useMemo(
    () => state.rawData.length > 0 && selectedMonthsCount > 0 && !state.isProcessing,
    [state.rawData.length, selectedMonthsCount, state.isProcessing]
  );

  const canExport = useMemo(() => hasValidData && !state.isProcessing, [hasValidData, state.isProcessing]);

  return {
    // State
    state,

    // File handling
    handleFileUpload,

    // Month selection
    handleMonthToggle,
    handleMonthSelectAll,
    handleMonthDeselectAll,
    handleSelectPreset,

    // Data processing
    processData,

    // Export
    handleExportToExcel,
    handleExportToTemplate,
    handleExportToCumulativeTemplate,

    // Reset
    resetState,

    // Computed values
    selectedMonthsCount,
    hasValidData,
    canProcess,
    canExport,
  };
};
