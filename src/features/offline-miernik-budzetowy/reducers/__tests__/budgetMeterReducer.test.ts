import { describe, it, expect } from "vitest";
import { budgetMeterReducer, initialBudgetMeterState } from "../budgetMeterReducer";
import type { BudgetMeterAction, AggregatedData } from "../../types";

describe("budgetMeterReducer", () => {
  describe("RESET_STATE", () => {
    it("should reset to initial state", () => {
      const modifiedState = {
        ...initialBudgetMeterState,
        fileName: "test.xlsx",
        rawData: [{ test: "data" }],
        isLoading: true,
      };

      const action: BudgetMeterAction = { type: "RESET_STATE" };
      const newState = budgetMeterReducer(modifiedState, action);

      expect(newState).toEqual(initialBudgetMeterState);
    });

    it("should reset all error states", () => {
      const stateWithErrors = {
        ...initialBudgetMeterState,
        fileError: "File error",
        monthError: "Month error",
        processingError: "Processing error",
      };

      const action: BudgetMeterAction = { type: "RESET_STATE" };
      const newState = budgetMeterReducer(stateWithErrors, action);

      expect(newState.fileError).toBeNull();
      expect(newState.monthError).toBeNull();
      expect(newState.processingError).toBeNull();
    });
  });

  describe("SET_LOADING", () => {
    it("should set loading to true", () => {
      const action: BudgetMeterAction = { type: "SET_LOADING", payload: true };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.isLoading).toBe(true);
    });

    it("should set loading to false", () => {
      const state = { ...initialBudgetMeterState, isLoading: true };
      const action: BudgetMeterAction = { type: "SET_LOADING", payload: false };
      const newState = budgetMeterReducer(state, action);

      expect(newState.isLoading).toBe(false);
    });

    it("should clear file error when loading starts", () => {
      const state = { ...initialBudgetMeterState, fileError: "Previous error" };
      const action: BudgetMeterAction = { type: "SET_LOADING", payload: true };
      const newState = budgetMeterReducer(state, action);

      expect(newState.fileError).toBeNull();
    });

    it("should preserve file error when loading stops", () => {
      const state = { ...initialBudgetMeterState, isLoading: true, fileError: "Error" };
      const action: BudgetMeterAction = { type: "SET_LOADING", payload: false };
      const newState = budgetMeterReducer(state, action);

      expect(newState.fileError).toBe("Error");
    });
  });

  describe("SET_FILE_ERROR", () => {
    it("should set file error", () => {
      const action: BudgetMeterAction = {
        type: "SET_FILE_ERROR",
        payload: "Invalid file",
      };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.fileError).toBe("Invalid file");
      expect(newState.isLoading).toBe(false);
    });

    it("should clear file error when payload is null", () => {
      const state = { ...initialBudgetMeterState, fileError: "Previous error" };
      const action: BudgetMeterAction = { type: "SET_FILE_ERROR", payload: null };
      const newState = budgetMeterReducer(state, action);

      expect(newState.fileError).toBeNull();
    });

    it("should stop loading when error is set", () => {
      const state = { ...initialBudgetMeterState, isLoading: true };
      const action: BudgetMeterAction = {
        type: "SET_FILE_ERROR",
        payload: "Error occurred",
      };
      const newState = budgetMeterReducer(state, action);

      expect(newState.isLoading).toBe(false);
    });

    it("should handle very long error messages", () => {
      const longError = "Error: " + "x".repeat(1000);
      const action: BudgetMeterAction = {
        type: "SET_FILE_ERROR",
        payload: longError,
      };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.fileError).toBe(longError);
    });

    it("should handle empty string as error", () => {
      const action: BudgetMeterAction = {
        type: "SET_FILE_ERROR",
        payload: "",
      };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.fileError).toBe("");
    });
  });

  describe("SET_MONTH_ERROR", () => {
    it("should set month error", () => {
      const action: BudgetMeterAction = {
        type: "SET_MONTH_ERROR",
        payload: "Invalid month selection",
      };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.monthError).toBe("Invalid month selection");
    });

    it("should clear month error when payload is null", () => {
      const state = { ...initialBudgetMeterState, monthError: "Previous error" };
      const action: BudgetMeterAction = { type: "SET_MONTH_ERROR", payload: null };
      const newState = budgetMeterReducer(state, action);

      expect(newState.monthError).toBeNull();
    });
  });

  describe("SET_PROCESSING_ERROR", () => {
    it("should set processing error", () => {
      const action: BudgetMeterAction = {
        type: "SET_PROCESSING_ERROR",
        payload: "Processing failed",
      };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.processingError).toBe("Processing failed");
      expect(newState.isProcessing).toBe(false);
    });

    it("should stop processing when error is set", () => {
      const state = { ...initialBudgetMeterState, isProcessing: true };
      const action: BudgetMeterAction = {
        type: "SET_PROCESSING_ERROR",
        payload: "Error",
      };
      const newState = budgetMeterReducer(state, action);

      expect(newState.isProcessing).toBe(false);
    });
  });

  describe("SET_FILE_DATA", () => {
    it("should set file data", () => {
      const mockData = [{ "Typ programu": "Test", "Nazwa programu": "Test Program" }];
      const action: BudgetMeterAction = {
        type: "SET_FILE_DATA",
        payload: { fileName: "test.xlsx", rawData: mockData },
      };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.fileName).toBe("test.xlsx");
      expect(newState.rawData).toEqual(mockData);
      expect(newState.isLoading).toBe(false);
      expect(newState.fileError).toBeNull();
    });

    it("should clear previous aggregated data", () => {
      const state = {
        ...initialBudgetMeterState,
        aggregatedData: { aggregated: {}, allPeople: 10, allActions: 5 },
      };
      const action: BudgetMeterAction = {
        type: "SET_FILE_DATA",
        payload: { fileName: "new.xlsx", rawData: [] },
      };
      const newState = budgetMeterReducer(state, action);

      expect(newState.aggregatedData).toBeNull();
    });

    it("should clear processing error", () => {
      const state = {
        ...initialBudgetMeterState,
        processingError: "Previous error",
      };
      const action: BudgetMeterAction = {
        type: "SET_FILE_DATA",
        payload: { fileName: "test.xlsx", rawData: [] },
      };
      const newState = budgetMeterReducer(state, action);

      expect(newState.processingError).toBeNull();
    });
  });

  describe("SET_SELECTED_MONTHS", () => {
    it("should set selected months", () => {
      const newMonths = [
        { monthNumber: 1, selected: true },
        { monthNumber: 2, selected: true },
      ];
      const action: BudgetMeterAction = {
        type: "SET_SELECTED_MONTHS",
        payload: newMonths,
      };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.selectedMonths).toEqual(newMonths);
      expect(newState.monthError).toBeNull();
    });

    it("should clear aggregated data when months change", () => {
      const state = {
        ...initialBudgetMeterState,
        aggregatedData: { aggregated: {}, allPeople: 10, allActions: 5 },
      };
      const action: BudgetMeterAction = {
        type: "SET_SELECTED_MONTHS",
        payload: [{ monthNumber: 1, selected: true }],
      };
      const newState = budgetMeterReducer(state, action);

      expect(newState.aggregatedData).toBeNull();
    });
  });

  describe("TOGGLE_MONTH", () => {
    it("should toggle month selection from false to true", () => {
      const action: BudgetMeterAction = { type: "TOGGLE_MONTH", payload: 1 };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.selectedMonths[0].selected).toBe(true);
    });

    it("should toggle month selection from true to false", () => {
      const state = {
        ...initialBudgetMeterState,
        selectedMonths: initialBudgetMeterState.selectedMonths.map((m) => (m.monthNumber === 1 ? { ...m, selected: true } : m)),
      };
      const action: BudgetMeterAction = { type: "TOGGLE_MONTH", payload: 1 };
      const newState = budgetMeterReducer(state, action);

      expect(newState.selectedMonths[0].selected).toBe(false);
    });

    it("should not toggle when month error exists", () => {
      const state = {
        ...initialBudgetMeterState,
        monthError: "Cannot change selection",
      };
      const action: BudgetMeterAction = { type: "TOGGLE_MONTH", payload: 1 };
      const newState = budgetMeterReducer(state, action);

      expect(newState).toBe(state); // Should return same state
      expect(newState.selectedMonths[0].selected).toBe(false);
    });

    it("should clear aggregated data when toggling month", () => {
      const state = {
        ...initialBudgetMeterState,
        aggregatedData: { aggregated: {}, allPeople: 10, allActions: 5 },
      };
      const action: BudgetMeterAction = { type: "TOGGLE_MONTH", payload: 1 };
      const newState = budgetMeterReducer(state, action);

      expect(newState.aggregatedData).toBeNull();
    });

    it("should only toggle the specified month", () => {
      const action: BudgetMeterAction = { type: "TOGGLE_MONTH", payload: 3 };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.selectedMonths[0].selected).toBe(false); // Month 1
      expect(newState.selectedMonths[1].selected).toBe(false); // Month 2
      expect(newState.selectedMonths[2].selected).toBe(true); // Month 3
      expect(newState.selectedMonths[3].selected).toBe(false); // Month 4
    });
  });

  describe("SET_AGGREGATED_DATA", () => {
    it("should set aggregated data", () => {
      const mockData: AggregatedData = {
        aggregated: {
          Edukacja: {
            "Program A": {
              Warsztaty: { people: 25, actionNumber: 5 },
            },
          },
        },
        allPeople: 25,
        allActions: 5,
      };
      const action: BudgetMeterAction = {
        type: "SET_AGGREGATED_DATA",
        payload: mockData,
      };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.aggregatedData).toEqual(mockData);
      expect(newState.isProcessing).toBe(false);
      expect(newState.processingError).toBeNull();
    });

    it("should clear processing error when data is set", () => {
      const state = {
        ...initialBudgetMeterState,
        processingError: "Previous error",
      };
      const mockData: AggregatedData = {
        aggregated: {},
        allPeople: 0,
        allActions: 0,
      };
      const action: BudgetMeterAction = {
        type: "SET_AGGREGATED_DATA",
        payload: mockData,
      };
      const newState = budgetMeterReducer(state, action);

      expect(newState.processingError).toBeNull();
    });
  });

  describe("SET_PROCESSING", () => {
    it("should set processing to true", () => {
      const action: BudgetMeterAction = { type: "SET_PROCESSING", payload: true };
      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.isProcessing).toBe(true);
    });

    it("should set processing to false", () => {
      const state = { ...initialBudgetMeterState, isProcessing: true };
      const action: BudgetMeterAction = { type: "SET_PROCESSING", payload: false };
      const newState = budgetMeterReducer(state, action);

      expect(newState.isProcessing).toBe(false);
    });

    it("should clear processing error when starting processing", () => {
      const state = {
        ...initialBudgetMeterState,
        processingError: "Previous error",
      };
      const action: BudgetMeterAction = { type: "SET_PROCESSING", payload: true };
      const newState = budgetMeterReducer(state, action);

      expect(newState.processingError).toBeNull();
    });

    it("should preserve processing error when stopping processing", () => {
      const state = {
        ...initialBudgetMeterState,
        isProcessing: true,
        processingError: "Error",
      };
      const action: BudgetMeterAction = { type: "SET_PROCESSING", payload: false };
      const newState = budgetMeterReducer(state, action);

      expect(newState.processingError).toBe("Error");
    });
  });

  describe("initialBudgetMeterState", () => {
    it("should have correct initial structure", () => {
      expect(initialBudgetMeterState).toEqual({
        fileName: "",
        rawData: [],
        isLoading: false,
        fileError: null,
        selectedMonths: expect.any(Array),
        monthError: null,
        aggregatedData: null,
        processingError: null,
        isProcessing: false,
      });
    });

    it("should have 12 months initialized", () => {
      expect(initialBudgetMeterState.selectedMonths).toHaveLength(12);
    });

    it("should have current month selected initially", () => {
      const currentMonthNumber = new Date().getMonth() + 1;
      const currentMonthSelected = initialBudgetMeterState.selectedMonths.find((m) => m.monthNumber === currentMonthNumber);
      expect(currentMonthSelected?.selected).toBe(true);
      
      // All other months should be unselected
      const otherMonthsUnselected = initialBudgetMeterState.selectedMonths
        .filter((m) => m.monthNumber !== currentMonthNumber)
        .every((m) => m.selected === false);
      expect(otherMonthsUnselected).toBe(true);
    });

    it("should have correct month numbers", () => {
      initialBudgetMeterState.selectedMonths.forEach((month, index) => {
        expect(month.monthNumber).toBe(index + 1);
      });
    });

    it("should be immutable - modifications should not affect original", () => {
      const stateCopy = { ...initialBudgetMeterState };
      stateCopy.fileName = "modified";

      expect(initialBudgetMeterState.fileName).toBe("");
    });
  });

  describe("Edge cases", () => {
    it("should handle unknown action type gracefully", () => {
      const unknownAction = { type: "UNKNOWN_ACTION", payload: null } as unknown as BudgetMeterAction;
      const newState = budgetMeterReducer(initialBudgetMeterState, unknownAction);

      expect(newState).toBe(initialBudgetMeterState);
    });

    it("should handle multiple consecutive state changes", () => {
      let state = initialBudgetMeterState;

      state = budgetMeterReducer(state, { type: "SET_LOADING", payload: true });
      expect(state.isLoading).toBe(true);

      state = budgetMeterReducer(state, {
        type: "SET_FILE_DATA",
        payload: { fileName: "test.xlsx", rawData: [] },
      });
      expect(state.fileName).toBe("test.xlsx");
      expect(state.isLoading).toBe(false);

      state = budgetMeterReducer(state, { type: "TOGGLE_MONTH", payload: 1 });
      expect(state.selectedMonths[0].selected).toBe(true);
    });

    it("should handle rapid TOGGLE_MONTH calls", () => {
      let state = initialBudgetMeterState;

      state = budgetMeterReducer(state, { type: "TOGGLE_MONTH", payload: 1 });
      state = budgetMeterReducer(state, { type: "TOGGLE_MONTH", payload: 1 });
      state = budgetMeterReducer(state, { type: "TOGGLE_MONTH", payload: 1 });

      expect(state.selectedMonths[0].selected).toBe(true); // Odd number of toggles
    });

    it("should handle SET_AGGREGATED_DATA with very large dataset", () => {
      const largeData: AggregatedData = {
        aggregated: Object.fromEntries(
          Array.from({ length: 100 }, (_, i) => [
            `ProgramType${i}`,
            Object.fromEntries(
              Array.from({ length: 10 }, (_, j) => [
                `Program${j}`,
                {
                  [`Action${j}`]: { people: 100, actionNumber: 50 },
                },
              ])
            ),
          ])
        ),
        allPeople: 100000,
        allActions: 50000,
      };

      const action: BudgetMeterAction = {
        type: "SET_AGGREGATED_DATA",
        payload: largeData,
      };

      const newState = budgetMeterReducer(initialBudgetMeterState, action);

      expect(newState.aggregatedData).toBeDefined();
      expect(newState.aggregatedData?.allPeople).toBe(100000);
    });

    it("should handle toggling all months sequentially", () => {
      let state = initialBudgetMeterState;
      const currentMonthNumber = new Date().getMonth() + 1;

      // First, unselect the current month by toggling it (going from selected to unselected)
      state = budgetMeterReducer(state, { type: "TOGGLE_MONTH", payload: currentMonthNumber });
      expect(state.selectedMonths.find((m) => m.monthNumber === currentMonthNumber)?.selected).toBe(false);

      // Now all months should be in the same unselected state, except others are still unselected
      // Toggle all other months to select them (they start as unselected)
      for (let i = 1; i <= 12; i++) {
        if (i !== currentMonthNumber) {
          state = budgetMeterReducer(state, { type: "TOGGLE_MONTH", payload: i });
        }
      }

      // After this, all months except current should be selected
      const otherMonthsSelected = state.selectedMonths
        .filter((m) => m.monthNumber !== currentMonthNumber)
        .every((m) => m.selected === true);
      expect(otherMonthsSelected).toBe(true);

      // Finally toggle the current month to select it too
      state = budgetMeterReducer(state, { type: "TOGGLE_MONTH", payload: currentMonthNumber });

      // Now all months should be selected
      expect(state.selectedMonths.every((m) => m.selected)).toBe(true);
    });

    it("should maintain state immutability across all operations", () => {
      const actions: BudgetMeterAction[] = [
        { type: "SET_LOADING", payload: true },
        { type: "SET_FILE_ERROR", payload: "Error" },
        { type: "TOGGLE_MONTH", payload: 1 },
        { type: "SET_PROCESSING", payload: true },
      ];

      actions.forEach((action) => {
        const newState = budgetMeterReducer(initialBudgetMeterState, action);
        expect(newState).not.toBe(initialBudgetMeterState); // Should create new object
      });
    });

    it("should return initial state reference for RESET_STATE", () => {
      const modifiedState = {
        ...initialBudgetMeterState,
        isLoading: true,
        fileError: "Some error",
      };
      const newState = budgetMeterReducer(modifiedState, { type: "RESET_STATE" });
      expect(newState).toBe(initialBudgetMeterState); // RESET_STATE returns the same reference
    });
  });
});
