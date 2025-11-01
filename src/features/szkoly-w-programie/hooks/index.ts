/**
 * Public API for Szkoły w Programie hooks.
 * Exports form, filter, table, and notification management hooks.
 */

// Form management
/** Hook for managing participation form state, validation, and submission */
export { useParticipationForm } from './useParticipationForm';

// Filter state management
/**
 * Hook for managing filter state with useReducer.
 * Replaces 6 separate useState hooks with a single source of truth.
 * @see filterDefaults for default filter values
 */
export { useFilterState } from './useFilterState';
export type { FilterAction } from './useFilterState';

// Table state management
/**
 * Hook for managing table UI state (dialogs, editing, selection).
 * Extracts state logic from table component for easier testing.
 */
export { useTableState } from './useTableState';
export type { FormRef } from './useTableState';

// Email menu logic
/** Hook for managing email list aggregation and clipboard operations */
export { useEmailMenuLogic } from './useEmailMenuLogic';

// Notification handling
/** Hook for managing participation-specific notifications and messages */
export { useParticipationNotifications } from './useParticipationNotifications';

// Type exports
export type { UseParticipationFormProps } from '../types';
