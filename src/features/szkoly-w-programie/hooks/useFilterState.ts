/**
 * useFilterState - Manages filter state with useReducer
 * 
 * Single hook replacing 6 useState calls:
 * - selectedSchoolYear
 * - selectedProgram
 * - schoolFilter
 * - programFilter
 * - statusFilter
 * - tableSearch
 *
 * Benefits:
 * - Single source of truth for filter state
 * - Easier to track state transitions
 * - Better for complex filter logic
 * - Type-safe filter actions
 */

import { useReducer } from 'react';
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
 * Filter reducer - handles all filter state transitions
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
 * Hook providing filter state and dispatch actions
 * Replaces 6 separate useState + 6 setters
 */
export function useFilterState() {
  const [filters, dispatch] = useReducer(filterReducer, DEFAULT_FILTERS as FilterState);

  return {
    filters,

    // Individual setters - convenience methods
    setSchoolYear: (year: string) => dispatch({ type: 'SET_SCHOOL_YEAR', payload: year }),
    setProgram: (program: string) => dispatch({ type: 'SET_PROGRAM', payload: program }),
    setSchoolName: (name: string) => dispatch({ type: 'SET_SCHOOL_NAME', payload: name }),
    setStatus: (status: typeof FILTER_VALUES[keyof typeof FILTER_VALUES]) => dispatch({ type: 'SET_STATUS', payload: status }),
    setSearch: (search: string) => dispatch({ type: 'SET_SEARCH', payload: search }),

    // Batch update - for multiple filters at once
    updateFilters: (updates: Partial<FilterState>) => dispatch({ type: 'UPDATE_FILTERS', payload: updates }),

    // Reset all filters to default
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
  };
}
