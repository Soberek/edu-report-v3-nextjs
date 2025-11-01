/**
 * Public API for utility functions.
 * Exports data transformation, validation, and business logic helpers.
 */

// Option factories for creating select/autocomplete options
export {
  createSchoolOptions,
  createContactOptions,
  createProgramOptions,
  createSchoolYearOptions,
} from './optionFactories';

// Core business logic and data transformation
export {
  createSchoolParticipationsMap,
  createLookupMaps,
  getApplicablePrograms,
  calculateSchoolParticipationInfo,
  calculateProgramStats,
  calculateGeneralStats,
  addParticipationCountToPrograms,
  filterBySchoolYear,
  filterByProgram,
  filterSchoolsByStatus,
  filterSchoolsByName,
  filterSchoolsByProgram,
  getAvailableSchoolYears,
  searchParticipations,
  createDefaultFormValues,
  mapParticipationsForDisplay,
} from './szkoly-w-programie.utils';

// Date and time utilities
export {
  getCurrentSchoolYear,
  isValidSchoolYear,
  formatDateToPolish,
} from './date.utils';

// Validation utilities
export {
  isValidEmail,
  isValidPhone,
  isValidId,
  isValidStudentCount,
  normalizeString,
} from './validation.utils';
export * from "./validation.utils";
export * from "./optionFactories";
