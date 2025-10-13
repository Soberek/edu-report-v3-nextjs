import { useCallback, useState } from "react";
import type { Month } from "../types";

/**
 * Custom hook for managing month selection state in Excel report generator.
 *
 * Provides functionality to select/deselect months with error handling.
 * When an error is present, month selection is disabled to prevent invalid states.
 *
 * @returns An object containing:
 * - `months` - Array of 12 month objects with selection state
 * - `handleMonthSelect` - Function to toggle month selection by month number (1-12)
 * - `error` - Current error message string
 *
 * @example
 * ```tsx
 * const { months, handleMonthSelect, error } = useMonthSelection();
 *
 *  Toggle selection for January (month 1)
 * handleMonthSelect(1);
 * ```
 */
export const useMonthSelection = () => {
  const [error, setError] = useState("");

  const [selectedMonths, setSelectedMonths] = useState<Month[]>(() =>
    new Array(12).fill(0).map((_, index) => ({
      monthNumber: index + 1,
      selected: false,
    }))
  );

  const handleMonthSelect = useCallback(
    (selected_month: number) => {
      if (error.length > 0) {
        console.warn("Error exists, cannot change month selection.");
        return;
      }
      setSelectedMonths((prevSelectedMonths) =>
        prevSelectedMonths.map((month) => (month.monthNumber === selected_month ? { ...month, selected: !month.selected } : month))
      );
      setError("");
    },
    [error.length]
  );

  return { selectedMonths, handleMonthSelect, error };
};
