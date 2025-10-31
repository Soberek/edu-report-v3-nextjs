"use client";

import React, { createContext, useMemo } from "react";
import { useSchoolsQuery, useContactsQuery, useProgramsQuery, useParticipationsQuery } from "../hooks/queries";
import { useParticipationMutations } from "../hooks/mutations";
import { useSchoolStatistics } from "../hooks/useSchoolStatistics";
import { useFilterState } from "../hooks/useFilterState";
import { useNotification } from "@/hooks";
import type { SchoolYear, School, Contact, Program, SchoolProgramParticipation } from "@/types";
import { createLookupMaps, mapParticipationsForDisplay } from "../utils";
import {
  addParticipationCountToPrograms,
  filterBySchoolYear,
  filterByProgram,
  filterSchoolsByStatus,
  filterSchoolsByName,
  filterSchoolsByProgram,
  getAvailableSchoolYears,
  searchParticipations,
} from "../utils/szkoly-w-programie.utils";
import type { SchoolParticipationContextType } from "../types/szkoly-w-programie.types";

// Create the context with a default undefined value
export const SchoolParticipationContext = createContext<SchoolParticipationContextType | undefined>(undefined);

// Create the provider component
export const SchoolParticipationProvider = ({ children }: { children: React.ReactNode }) => {
  // 1. Server State Management
  const { data: schoolsData, isLoading: schoolsLoading, error: schoolsError } = useSchoolsQuery();
  const { data: contactsData, isLoading: contactsLoading, error: contactsError } = useContactsQuery();
  const { data: programsData, isLoading: programsLoading, error: programsError } = useProgramsQuery();
  const { data: allParticipationsData, isLoading: participationsLoading, error: participationsError } = useParticipationsQuery();

  const schools = schoolsData ?? [];
  const contacts = contactsData ?? [];
  const programs = programsData ?? [];
  const allParticipations = allParticipationsData ?? [];

  const { addParticipation, updateParticipation, deleteParticipation } = useParticipationMutations();
  const { notification, close: closeNotification } = useNotification();

  // 2. Filter State Management (unified with useReducer)
  const { filters, setSchoolYear, setProgram, setSchoolName, setStatus, setSearch, resetFilters } = useFilterState();

  // 3. Combined Loading and Error State
  const isLoading = useMemo(
    () => schoolsLoading || contactsLoading || programsLoading || participationsLoading,
    [schoolsLoading, contactsLoading, programsLoading, participationsLoading]
  );
  const error = useMemo(
    () => (schoolsError || contactsError || programsError || participationsError) as Error | null,
    [schoolsError, contactsError, programsError, participationsError]
  );

  // 4. Memoized Derivations & Calculations
  const { schoolsInfo, generalStats, programStats } = useSchoolStatistics(schools, programs, allParticipations, isLoading);
  const lookupMaps = useMemo(() => createLookupMaps(schools, contacts, programs), [schools, contacts, programs]);

  const participationsByYear = useMemo(() => {
    if (!allParticipations) return [];
    return filterBySchoolYear(allParticipations, filters.schoolYear);
  }, [allParticipations, filters.schoolYear]);

  const filteredParticipations = useMemo(() => {
    if (!participationsByYear) return [];
    return searchParticipations(filterByProgram(participationsByYear, filters.program), lookupMaps.schoolsMap, lookupMaps.contactsMap, lookupMaps.programsMap, filters.search);
  }, [participationsByYear, filters.program, filters.search, lookupMaps]);

  const mappedParticipations = useMemo(
    () => mapParticipationsForDisplay(filteredParticipations, lookupMaps.schoolsMap, lookupMaps.contactsMap, lookupMaps.programsMap),
    [filteredParticipations, lookupMaps]
  );

  const availableSchoolYears = useMemo(() => getAvailableSchoolYears(allParticipations), [allParticipations]);

  const availablePrograms = useMemo(() => {
    if (!participationsByYear || !programs) return [];
    return Array.from(addParticipationCountToPrograms(programs, participationsByYear));
  }, [participationsByYear, programs]);

  const filteredSchoolsInfo = useMemo(() => {
    let filtered = schoolsInfo || [];
    filtered = filterSchoolsByName(filtered, filters.schoolName);
    const activeProgramFilter = filters.program !== "all" ? filters.program : filters.schoolName;
    filtered = filterSchoolsByProgram(filtered, activeProgramFilter);
    filtered = filterSchoolsByStatus(filtered, filters.status);
    return filtered;
  }, [schoolsInfo, filters.schoolName, filters.program, filters.status]);

  // UI-Ready Data for Selectors
  const schoolOptions = useMemo(
    () => schools.map((school) => ({ label: school.name, value: school.name })),
    [schools]
  );

  const programOptions = useMemo(
    () => programs.map((program) => ({ label: program.name, value: program.id })),
    [programs]
  );

  // 5. Assemble the context value
  const value: SchoolParticipationContextType = {
    isLoading,
    error,
    schools,
    contacts,
    programs,
    allParticipations,
    participations: filteredParticipations,
    participationsByYear,
    mappedParticipations,
    schoolsInfo: filteredSchoolsInfo,
    generalStats,
    programStats,
    availableSchoolYears,
    availablePrograms,
    lookupMaps,
    schoolOptions,
    programOptions,
    // Filter state (from useFilterState hook)
    filters,
    setSchoolYear,
    setProgram,
    setSchoolName,
    setStatus,
    setSearch,
    resetFilters,
    notification,
    closeNotification,
    handleSubmit: addParticipation,
    handleUpdateParticipation: updateParticipation,
    handleDeleteParticipation: deleteParticipation,
  };

  return (
    <SchoolParticipationContext.Provider value={value}>
      {children}
    </SchoolParticipationContext.Provider>
  );
};
