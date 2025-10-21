import { useState, useMemo, useEffect } from "react";
import type { ExcelRow, Month } from "../../../types";
import { aggregateByIndicators, type IndicatorAggregatedData, type AggregateOptions } from "../utils/aggregateByIndicators";

export interface UseWskaznikiOptions extends AggregateOptions {
  rawData: ExcelRow[];
  selectedMonths: Month[];
  useAllGroupings?: boolean; // If true, apply ALL programGroups from all indicators
}

/**
 * Custom hook for managing indicators aggregation logic.
 * It uses the pure `aggregateByIndicators` function for calculations
 * and manages React state (loading, error, data).
 */
export function useWskazniki({ rawData, selectedMonths, indicatorId, useAllGroupings }: UseWskaznikiOptions) {
  const [state, setState] = useState<IndicatorAggregatedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize selected month numbers to prevent re-calculations
  const selectedMonthNumbers = useMemo(() => {
    return selectedMonths.filter((m) => m.selected).map((m) => m.monthNumber);
  }, [selectedMonths]);

  // Memoize options to prevent useEffect from running unnecessarily
  const aggregationOptions = useMemo(() => ({ indicatorId, useAllGroupings }), [indicatorId, useAllGroupings]);

  // Perform aggregation when data or options change
  useEffect(() => {
    const processData = () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = aggregateByIndicators(rawData, selectedMonthNumbers, aggregationOptions);
        setState(result);

      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during aggregation";
        setError(errorMessage);
        setState(null);
      } finally {
        setIsLoading(false);
      }
    };

    processData();
  }, [rawData, selectedMonthNumbers, aggregationOptions]);

  const formatGroupedName = (displayName: string) => {
    if (state?.groupDefinitions && state.groupDefinitions[displayName]) {
      const programs = state.groupDefinitions[displayName];
      return `🔗 Połączone: ${programs.join(", ")}`;
    }
    return displayName;
  };

  return {
    state,
    isLoading,
    error,
    hasData: state !== null && state.totalActions > 0,
    formatGroupedName,
  };
}