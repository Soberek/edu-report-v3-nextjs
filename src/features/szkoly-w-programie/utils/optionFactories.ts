/**
 * Option factory functions for select/autocomplete components.
 * Centralizes data transformation logic to eliminate duplication and ensure consistency.
 * Pure functions with no side effects - suitable for memoization.
 */

import type { School, Contact, Program } from '@/types';
import type { AutocompleteOption } from '@/components/shared';

/**
 * Creates autocomplete options from schools.
 * Pure function for easy testing and memoization.
 * @param schools - Array of schools
 * @returns Autocomplete-compatible options
 * @example createSchoolOptions([{ id: '1', name: 'School A' }])
 */
export const createSchoolOptions = (
  schools: readonly School[]
): AutocompleteOption[] =>
  schools.map(school => ({
    id: school.id,
    name: school.name,
  }));

/**
 * Creates autocomplete options from contacts using full name.
 * Pure function for easy testing and memoization.
 * @param contacts - Array of contacts
 * @returns Autocomplete-compatible options
 * @example createContactOptions([{ id: '1', firstName: 'John', lastName: 'Doe' }])
 */
export const createContactOptions = (
  contacts: readonly Contact[]
): AutocompleteOption[] =>
  contacts.map(contact => ({
    id: contact.id,
    name: `${contact.firstName} ${contact.lastName}`,
  }));

/**
 * Creates autocomplete options from programs.
 * Pure function for easy testing and memoization.
 * @param programs - Array of programs
 * @returns Autocomplete-compatible options
 * @example createProgramOptions([{ id: '1', name: 'Program A', code: 'P1' }])
 */
export const createProgramOptions = (
  programs: readonly Program[]
): AutocompleteOption[] =>
  programs.map(program => ({
    id: program.id,
    name: program.code ? `${program.code} - ${program.name}` : program.name,
  }));

/**
 * Creates autocomplete options from school year strings.
 * Pure function for easy testing and memoization.
 * @param schoolYears - Array of school year strings (e.g., "2024/2025")
 * @returns Autocomplete-compatible options
 * @example createSchoolYearOptions(['2024/2025', '2025/2026'])
 */
export const createSchoolYearOptions = (
  schoolYears: readonly string[]
): AutocompleteOption[] =>
  schoolYears.map(year => ({
    id: year,
    name: year,
  }));
