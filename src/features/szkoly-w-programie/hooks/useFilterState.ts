/**
 * useFilterState - Manages filter state with useReducer.
 * Single hook replacing 6 useState calls with a unified state machine.
 *
 * Benefits:
 * - Single source of truth for filter state
 * - Easier to track state transitions and debug
 * - Better for complex filter logic
 * - Type-safe filter actions
 * - Memoized dispatcher functions to prevent context re-renders
 */

import { useReducer, useCallback } from 'react';
import type { FilterState } from '../constants/filterDefaults';
import { DEFAULT_FILTERS, FILTER_VALUES } from '../constants/filterDefaults';

export type FilterAction =
  | { type: 'SET_SCHOOL_YEAR'; payload: string }
  | { type: 'SET_PROGRAM'; payload: string }
  | { type: 'SET_SCHOOL_NAME'; payload: string }
  | { type: 'SET_STATUS'; payload: typeof FILTER_VALUES[keyof typeof FILTER_VALUES] }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' };

/**
 * Filter reducer - handles all filter state transitions.
 * Pure function suitable for testing.
 */
const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_SCHOOL_YEAR':
      return { ...state, schoolYear: action.payload };
    case 'SET_PROGRAM':
      return { ...state, program: action.payload };
    case 'SET_SCHOOL_NAME':
      return { ...state, schoolName: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, ...action.payload };
    case 'RESET_FILTERS':
      return DEFAULT_FILTERS as FilterState;
    default:
      return state;
  }
};

/**
 * Hook providing filter state and memoized dispatcher functions.
 * Replaces 6 separate useState + 6 setters with unified state management.
 *
 * @returns Current filter state and typed dispatcher functions
 *
 * @example
 * const {
 *   filters,
 *   setSchoolYear,
 *   setProgram,
 *   resetFilters,
 * } = useFilterState();
 *
 * return (
 *   <Select
 *     value={filters.schoolYear}
 *     onChange={(e) => setSchoolYear(e.target.value)}
 *   />
 * );
 */
export function useFilterState() {
  const [filters, dispatch] = useReducer(filterReducer, DEFAULT_FILTERS as FilterState);

  // Memoize dispatcher functions to prevent context re-renders
  const setSchoolYear = useCallback((year: string) => {
    dispatch({ type: 'SET_SCHOOL_YEAR', payload: year });
  }, []);

  const setProgram = useCallback((program: string) => {
    dispatch({ type: 'SET_PROGRAM', payload: program });
  }, []);

  const setSchoolName = useCallback((name: string) => {
    dispatch({ type: 'SET_SCHOOL_NAME', payload: name });
  }, []);

  const setStatus = useCallback(
    (status: typeof FILTER_VALUES[keyof typeof FILTER_VALUES]) => {
      dispatch({ type: 'SET_STATUS', payload: status });
    },
    []
  );

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search });
  }, []);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: updates });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return {
    filters,
    setSchoolYear,
    setProgram,
    setSchoolName,
    setStatus,
    setSearch,
    updateFilters,
    resetFilters,
  };
}
