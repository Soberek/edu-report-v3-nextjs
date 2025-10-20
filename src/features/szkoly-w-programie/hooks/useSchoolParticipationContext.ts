
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
    participations,
    mappedParticipations,
    schoolsInfo,
    generalStats,
    programStats,
    availableSchoolYears,
    availablePrograms,
    lookupMaps,
  } = useSafeContext();
  return {
    schools,
    contacts,
    programs,
    participations,
    mappedParticipations,
    schoolsInfo,
    generalStats,
    programStats,
    availableSchoolYears,
    availablePrograms,
    lookupMaps,
  };
};

/**
 * Hook to access and manage the feature's filter state.
 * Follows SRP and ISP.
 */
export const useParticipationFilters = () => {
  const {
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
  } = useSafeContext();
  return {
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
