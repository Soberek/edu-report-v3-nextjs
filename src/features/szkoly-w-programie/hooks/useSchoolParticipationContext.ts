
import { useContext } from "react";
import { SchoolParticipationContext } from "../context/SchoolParticipationContext";

/**
 * Custom hook to safely consume the SchoolParticipationContext.
 * Throws an error if used outside of a SchoolParticipationProvider.
 */
const useSafeContext = () => {
  const context = useContext(SchoolParticipationContext);
  if (context === undefined) {
    throw new Error("useSafeContext must be used within a SchoolParticipationProvider");
  }
  return context;
};

/**
 * Hook to access the loading and error status of the feature.
 * Follows ISP by only exposing status-related properties.
 */
export const useParticipationStatus = () => {
  const { isLoading, error } = useSafeContext();
  return { isLoading, error };
};

/**
 * Hook to access the derived data for the UI.
 * Follows ISP by only exposing data properties.
 */
export const useParticipationData = () => {
  const {
    schools,
    contacts,
    programs,
    allParticipations,
    participations,
    participationsByYear,
    mappedParticipations,
    schoolsInfo,
    generalStats,
    programStats,
    availableSchoolYears,
    availablePrograms,
    lookupMaps,
    schoolOptions,
    programOptions,
  } = useSafeContext();
  return {
    schools,
    contacts,
    programs,
    allParticipations,
    participations,
    participationsByYear,
    mappedParticipations,
    schoolsInfo,
    generalStats,
    programStats,
    availableSchoolYears,
    availablePrograms,
    lookupMaps,
    schoolOptions,
    programOptions,
  };
};

/**
 * Hook to access and manage the feature's filter state.
 * Follows SRP and ISP.
 */
export const useParticipationFilters = () => {
  const {
    filters,
    setSchoolYear,
    setProgram,
    setSchoolName,
    setStatus,
    setSearch,
    resetFilters,
  } = useSafeContext();
  
  return {
    // Filter state
    filters,
    
    // Backward compatibility: legacy filter values
    selectedSchoolYear: filters.schoolYear,
    selectedProgram: filters.program,
    schoolFilter: filters.schoolName || null,
    programFilter: filters.program,
    statusFilter: filters.status,
    tableSearch: filters.search,
    
    // Action functions
    setSchoolYear,
    setProgram,
    setSchoolName,
    setStatus,
    setSearch,
    resetFilters,
    
    // Legacy compatibility: direct setter functions
    setSelectedSchoolYear: setSchoolYear,
    setSelectedProgram: setProgram,
    setSchoolFilter: (value: string | null) => setSchoolName(value || ""),
    setProgramFilter: (value: string | null) => setProgram(value || "all"),
    setStatusFilter: setStatus,
    setTableSearch: setSearch,
  };
};

/**
 * Hook to access mutation functions and notification state.
 * Follows SRP and ISP.
 */
export const useParticipationActions = () => {
  const {
    notification,
    closeNotification,
    handleSubmit,
    handleUpdateParticipation,
    handleDeleteParticipation,
  } = useSafeContext();
  return {
    notification,
    closeNotification,
    handleSubmit,
    handleUpdateParticipation,
    handleDeleteParticipation,
  };
};
