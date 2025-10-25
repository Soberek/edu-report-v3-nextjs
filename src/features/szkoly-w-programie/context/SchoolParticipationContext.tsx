"use client";

import React, { createContext, useState, useMemo } from "react";
import { useSchoolsQuery, useContactsQuery, useProgramsQuery, useParticipationsQuery } from "../hooks/queries";
import { useParticipationMutations } from "../hooks/mutations";
import { useSchoolStatistics } from "../hooks/useSchoolStatistics";
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

  // 2. Combined Loading and Error State
  const isLoading = useMemo(
    () => schoolsLoading || contactsLoading || programsLoading || participationsLoading,
    [schoolsLoading, contactsLoading, programsLoading, participationsLoading]
  );
  const error = useMemo(
    () => (schoolsError || contactsError || programsError || participationsError) as Error | null,
    [schoolsError, contactsError, programsError, participationsError]
  );

  // 3. Client-side State (Filters)
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<SchoolYear | "all">("2025/2026");
  const [selectedProgram, setSelectedProgram] = useState<string | "all">("all");
  const [schoolFilter, setSchoolFilter] = useState<string | null>(null);
  const [programFilter, setProgramFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "participating" | "notParticipating">("all");
  const [tableSearch, setTableSearch] = useState<string>("");

  // 4. Memoized Derivations & Calculations
  const { schoolsInfo, generalStats, programStats } = useSchoolStatistics(schools, programs, allParticipations, isLoading);
  const lookupMaps = useMemo(() => createLookupMaps(schools, contacts, programs), [schools, contacts, programs]);

  const filteredParticipations = useMemo(() => {
    if (!allParticipations) return [];
    let filtered = filterBySchoolYear(allParticipations, selectedSchoolYear);
    filtered = filterByProgram(filtered, selectedProgram);
    return searchParticipations(filtered, lookupMaps.schoolsMap, lookupMaps.contactsMap, lookupMaps.programsMap, tableSearch);
  }, [allParticipations, selectedSchoolYear, selectedProgram, tableSearch, lookupMaps]);

  const mappedParticipations = useMemo(
    () => mapParticipationsForDisplay(filteredParticipations, lookupMaps.schoolsMap, lookupMaps.contactsMap, lookupMaps.programsMap),
    [filteredParticipations, lookupMaps]
  );

  const availableSchoolYears = useMemo(() => getAvailableSchoolYears(allParticipations), [allParticipations]);

  const availablePrograms = useMemo(() => {
    if (!allParticipations || !programs) return [];
    const yearFilteredParticipations = filterBySchoolYear(allParticipations, selectedSchoolYear);
    return Array.from(addParticipationCountToPrograms(programs, yearFilteredParticipations));
  }, [allParticipations, selectedSchoolYear, programs]);

  const filteredSchoolsInfo = useMemo(() => {
    let filtered = schoolsInfo || [];
    filtered = filterSchoolsByName(filtered, schoolFilter);
    const activeProgramFilter = selectedProgram !== "all" ? selectedProgram : programFilter;
    filtered = filterSchoolsByProgram(filtered, activeProgramFilter);
    filtered = filterSchoolsByStatus(filtered, statusFilter);
    return filtered;
  }, [schoolsInfo, schoolFilter, selectedProgram, programFilter, statusFilter]);

  // 5. Assemble the context value
  const value: SchoolParticipationContextType = {
    isLoading,
    error,
    schools,
    contacts,
    programs,
    participations: filteredParticipations,
    mappedParticipations,
    schoolsInfo: filteredSchoolsInfo,
    generalStats,
    programStats,
    availableSchoolYears,
    availablePrograms,
    lookupMaps,
    selectedSchoolYear,
    setSelectedSchoolYear,
    selectedProgram,
    setSelectedProgram,
    schoolFilter,
    setSchoolFilter,
    programFilter,
    setProgramFilter,
    statusFilter,
    setStatusFilter,
    tableSearch,
    setTableSearch,
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
