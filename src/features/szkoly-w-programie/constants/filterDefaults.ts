/**
 * Filter value constants - centralized place for all filter options
 * Prevents "magic strings" scattered throughout codebase
 */

export const FILTER_VALUES = {
  ALL: 'all',
  PARTICIPATING: 'participating',
  NOT_PARTICIPATING: 'notParticipating',
} as const;

export type FilterValue = typeof FILTER_VALUES[keyof typeof FILTER_VALUES];
export type StatusFilterValue = Extract<FilterValue, 'all' | 'participating' | 'notParticipating'>;

/**
 * Default filter state - single source of truth for initial filter values
 */
export const DEFAULT_FILTERS = {
  schoolYear: FILTER_VALUES.ALL,
  program: FILTER_VALUES.ALL,
  schoolName: '',
  status: FILTER_VALUES.ALL,
  search: '',
} as const;

export type FilterState = {
  schoolYear: string;
  program: string;
  schoolName: string;
  status: typeof FILTER_VALUES[keyof typeof FILTER_VALUES];
  search: string;
};
