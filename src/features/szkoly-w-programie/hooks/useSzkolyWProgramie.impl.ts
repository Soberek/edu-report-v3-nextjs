import { useState, useMemo, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { usePrograms } from "@/features/programy-edukacyjne/hooks/useProgram";
import { School, Contact, SchoolProgramParticipation, SchoolProgramParticipationDTO, SchoolYear } from "@/types";
import { schoolProgramParticipationDTOSchema, schoolProgramParticiapationUpdateDTOSchema } from "@/models/SchoolProgramParticipation";
import { createLookupMaps, mapParticipationsForDisplay } from "../utils";
import { MESSAGES } from "../constants";
import type { ProgramWithCount } from "../types";
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
} from "../utils/szkoly-w-programie.utils";
import { getErrorMessage, normalizeStudentCount } from "@/hooks/utils/error-handler.utils";
import { useNotification } from "@/hooks";

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

  const { notification, showSuccess, showError, close: closeNotification } = useNotification();

  // --- Filter State ---
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<SchoolYear | "all">("2025/2026");
  const [selectedProgram, setSelectedProgram] = useState<string | "all">("all");
  const [schoolFilter, setSchoolFilter] = useState<string | null>(null);
  const [programFilter, setProgramFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "participating" | "notParticipating">("all");

  const isLoading = useMemo(
    () => schoolsLoading || contactsLoading || programsLoading || participationsLoading,
    [schoolsLoading, contactsLoading, programsLoading, participationsLoading]
  );
  const error = useMemo(() => schoolsError || contactsError, [schoolsError, contactsError]);

  const lookupMaps = useMemo(() => createLookupMaps(schools || [], contacts || [], programs || []), [schools, contacts, programs]);

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

  const availablePrograms = useMemo<ProgramWithCount[]>(() => {
    if (!filteredParticipations || !programs) return [];
    return Array.from(addParticipationCountToPrograms(programs, filteredParticipations));
  }, [filteredParticipations, programs]);

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
    const newGeneralStats = calculateGeneralStats(schools, newSchoolsInfo, newProgramStats, allParticipations);

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

  const handleSubmit = useCallback(
    async (data: SchoolProgramParticipationDTO) => {
      try {
        const validatedData = schoolProgramParticipationDTOSchema.parse({
          ...data,
          studentCount: normalizeStudentCount(data.studentCount),
        });
        await createSchoolProgramParticipation(validatedData);
        showSuccess(MESSAGES.SUCCESS.PARTICIPATION_ADDED);
      } catch (error) {
        const errorMessage = getErrorMessage(error, MESSAGES.ERROR.SAVE_FAILED);
        showError(errorMessage);
        throw error;
      }
    },
    [createSchoolProgramParticipation, showSuccess, showError]
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
        showSuccess(MESSAGES.SUCCESS.PARTICIPATION_UPDATED);
      } catch (error) {
        const errorMessage = getErrorMessage(error, MESSAGES.ERROR.UPDATE_FAILED);
        showError(errorMessage);
        throw error;
      }
    },
    [updateSchoolProgramParticipation, showSuccess, showError]
  );

  const handleDeleteParticipation = useCallback(
    async (id: string) => {
      try {
        await deleteSchoolProgramParticipation(id);
        showSuccess(MESSAGES.SUCCESS.PARTICIPATION_DELETED);
      } catch (error) {
        showError(MESSAGES.ERROR.DELETE_FAILED);
        throw error;
      }
    },
    [deleteSchoolProgramParticipation, showSuccess, showError]
  );

  return {
    isLoading,
    error,
    notification,
    schools: schools || [],
    contacts: contacts || [],
    programs: programs || [],
    allParticipations: allParticipations || [],
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
    closeNotification,
    schoolsInfo: filteredSchoolsInfo,
    generalStats,
    programStats,
    schoolFilter,
    setSchoolFilter,
    programFilter,
    setProgramFilter,
    statusFilter,
    setStatusFilter,
    lookupMaps,
  };
};
