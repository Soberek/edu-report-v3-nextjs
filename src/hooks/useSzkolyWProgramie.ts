import { useState, useMemo, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { usePrograms } from "@/hooks/useProgram";
import { School, Program, Contact, SchoolProgramParticipation, SchoolProgramParticipationDTO, SchoolYear } from "@/types";
import { schoolProgramParticipationDTOSchema, schoolProgramParticiapationUpdateDTOSchema } from "@/models/SchoolProgramParticipation";
import { createLookupMaps, mapParticipationsForDisplay } from "@/app/(protected)/szkoly-w-programie/utils";
import { MESSAGES } from "@/app/(protected)/szkoly-w-programie/constants";
import type {
  SnackbarState,
  ProgramWithCount,
  ProgramStats,
  GeneralStats,
  SchoolParticipationInfo,
} from "./types/szkoly-w-programie.types";
import {
  createSchoolParticipationsMap,
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
} from "./utils/szkoly-w-programie.utils";
import { getErrorMessage, normalizeStudentCount } from "./utils/error-handler.utils";

/**
 * Custom hook for managing school program participations
 *
 * This hook provides comprehensive functionality for:
 * - Fetching and managing school program participation data
 * - Filtering participations by school year and program
 * - Calculating statistics for participating and non-participating schools
 * - CRUD operations on participation records
 * - Managing UI state (loading, errors, snackbar messages)
 *
 * @returns {Object} Hook state and handlers
 *
 * @example
 * ```tsx
 * function SchoolProgramsPage() {
 *   const {
 *     schools,
 *     programs,
 *     participations,
 *     handleSubmit,
 *     isLoading,
 *   } = useSzkolyWProgramie();
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       <ParticipationForm onSubmit={handleSubmit} />
 *       <ParticipationTable data={participations} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useSzkolyWProgramie = () => {
  const { user } = useUser();

  // Data Fetching
  const { data: schools, loading: schoolsLoading, error: schoolsError } = useFirebaseData<School>("schools", user?.uid);
  const { data: contacts, loading: contactsLoading, error: contactsError } = useFirebaseData<Contact>("contacts", user?.uid);
  const { programs, loading: programsLoading } = usePrograms();
  const {
    data: allParticipations,
    loading: participationsLoading,
    createItem: createSchoolProgramParticipation,
    updateItem: updateSchoolProgramParticipation,
    deleteItem: deleteSchoolProgramParticipation,
  } = useFirebaseData<SchoolProgramParticipation>("school-program-participation", user?.uid);

  // Snackbar State
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    type: "success",
    message: "",
  });

  // --- Filter State ---
  // For ParticipationView
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<SchoolYear | "all">("2025/2026");
  const [selectedProgram, setSelectedProgram] = useState<string | "all">("all");
  // For NonParticipationView
  const [schoolFilter, setSchoolFilter] = useState<string | null>(null);
  const [programFilter, setProgramFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "participating" | "notParticipating">("all");

  // Memoized Loading and Error states
  const isLoading = useMemo(
    () => schoolsLoading || contactsLoading || programsLoading || participationsLoading,
    [schoolsLoading, contactsLoading, programsLoading, participationsLoading]
  );
  const error = useMemo(() => schoolsError || contactsError, [schoolsError, contactsError]);

  // Memoized Lookup Maps
  const lookupMaps = useMemo(() => createLookupMaps(schools || [], contacts || [], programs || []), [schools, contacts, programs]);

  // --- Logic for ParticipationView ---
  const filteredParticipations = useMemo(() => {
    if (!allParticipations) return [];
    let filtered = filterBySchoolYear(allParticipations, selectedSchoolYear);
    filtered = filterByProgram(filtered, selectedProgram);
    return filtered;
  }, [allParticipations, selectedSchoolYear, selectedProgram]);

  const mappedParticipations = useMemo(
    () => mapParticipationsForDisplay(filteredParticipations, lookupMaps.schoolsMap, lookupMaps.contactsMap, lookupMaps.programsMap),
    [filteredParticipations, lookupMaps]
  );

  const availableSchoolYears = useMemo(() => {
    if (!allParticipations) return [];
    return getAvailableSchoolYears(allParticipations);
  }, [allParticipations]);

  const availablePrograms = useMemo<readonly ProgramWithCount[]>(() => {
    if (!filteredParticipations || !programs) return [];
    return addParticipationCountToPrograms(programs, filteredParticipations);
  }, [filteredParticipations, programs]);

  // --- Logic for NonParticipationView ---
  const { schoolsInfo, generalStats, programStats } = useMemo(() => {
    if (isLoading || !schools || !programs || !allParticipations) {
      return {
        schoolsInfo: [],
        generalStats: {
          totalSchools: 0,
          nonParticipatingCount: 0,
          totalParticipations: 0,
          totalMissingParticipations: 0,
        },
        programStats: {},
      };
    }

    const schoolParticipationsMap = createSchoolParticipationsMap(allParticipations);
    const newSchoolsInfo = calculateSchoolParticipationInfo(schools, programs, schoolParticipationsMap);
    const newProgramStats = calculateProgramStats(schools, programs, schoolParticipationsMap);
    const newGeneralStats = calculateGeneralStats(schools, newSchoolsInfo, newProgramStats);

    return {
      schoolsInfo: newSchoolsInfo,
      generalStats: newGeneralStats,
      programStats: newProgramStats,
    };
  }, [isLoading, schools, programs, allParticipations]);

  const filteredSchoolsInfo = useMemo(() => {
    let filtered = schoolsInfo;

    filtered = filterSchoolsByName(filtered, schoolFilter);
    filtered = filterSchoolsByProgram(filtered, programFilter);
    filtered = filterSchoolsByStatus(filtered, statusFilter);

    return filtered;
  }, [schoolsInfo, schoolFilter, programFilter, statusFilter]);

  // --- Handlers ---
  const showSuccessMessage = useCallback((message: string) => setSnackbar({ open: true, type: "success", message }), []);

  const showErrorMessage = useCallback((message: string) => setSnackbar({ open: true, type: "error", message }), []);

  const handleCloseSnackbar = useCallback(() => setSnackbar((prev) => ({ ...prev, open: false })), []);

  const handleSubmit = useCallback(
    async (data: SchoolProgramParticipationDTO) => {
      try {
        const validatedData = schoolProgramParticipationDTOSchema.parse({
          ...data,
          studentCount: normalizeStudentCount(data.studentCount),
        });
        await createSchoolProgramParticipation(validatedData);
        showSuccessMessage(MESSAGES.SUCCESS.PARTICIPATION_ADDED);
      } catch (error) {
        const errorMessage = getErrorMessage(error, MESSAGES.ERROR.SAVE_FAILED);
        showErrorMessage(errorMessage);
        throw error;
      }
    },
    [createSchoolProgramParticipation, showSuccessMessage, showErrorMessage]
  );

  const handleUpdateParticipation = useCallback(
    async (id: string, data: Partial<SchoolProgramParticipation>) => {
      try {
        const validatedData = schoolProgramParticiapationUpdateDTOSchema.parse({
          ...data,
          id,
          studentCount: normalizeStudentCount(data.studentCount),
        });
        await updateSchoolProgramParticipation(id, validatedData);
        showSuccessMessage(MESSAGES.SUCCESS.PARTICIPATION_UPDATED);
      } catch (error) {
        const errorMessage = getErrorMessage(error, MESSAGES.ERROR.UPDATE_FAILED);
        showErrorMessage(errorMessage);
        throw error;
      }
    },
    [updateSchoolProgramParticipation, showSuccessMessage, showErrorMessage]
  );

  const handleDeleteParticipation = useCallback(
    async (id: string) => {
      try {
        await deleteSchoolProgramParticipation(id);
        showSuccessMessage(MESSAGES.SUCCESS.PARTICIPATION_DELETED);
      } catch (error) {
        showErrorMessage(MESSAGES.ERROR.DELETE_FAILED);
        throw error;
      }
    },
    [deleteSchoolProgramParticipation, showSuccessMessage, showErrorMessage]
  );

  return {
    // State
    isLoading,
    error,
    snackbar,
    schools: schools || [],
    contacts: contacts || [],
    programs: programs || [],
    allParticipations: allParticipations || [],

    // Participation View Data & Handlers
    participations: filteredParticipations || [],
    mappedParticipations,
    selectedSchoolYear,
    setSelectedSchoolYear,
    availableSchoolYears,
    selectedProgram,
    setSelectedProgram,
    availablePrograms,
    handleSubmit,
    handleUpdateParticipation,
    handleDeleteParticipation,
    handleCloseSnackbar,

    // Non-Participation View Data
    schoolsInfo: filteredSchoolsInfo, // Use the filtered data
    generalStats,
    programStats,
    schoolFilter,
    setSchoolFilter,
    programFilter,
    setProgramFilter,
    statusFilter,
    setStatusFilter,

    // Lookup Maps
    lookupMaps,
  };
};
