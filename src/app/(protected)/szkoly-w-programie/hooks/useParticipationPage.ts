import React, { useState, useCallback, useMemo } from "react";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { usePrograms } from "@/hooks/useProgram";
import type { Contact, Program, School as SchoolType } from "@/types";
import type { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { schoolProgramParticipationDTOSchema, schoolProgramParticiapationUpdateDTOSchema } from "@/models/SchoolProgramParticipation";
import { createLookupMaps, mapParticipationsForDisplay } from "../utils";
import { UI_CONSTANTS, MESSAGES } from "../constants";
import type { UseParticipationPageProps, SnackbarMessage, MappedParticipation } from "../types";

export const useParticipationPage = ({ onUpdate, onDelete }: UseParticipationPageProps = {}) => {
  const userContext = useUser();

  // Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarMessage>({
    open: false,
    type: "success",
    message: "",
  });

  // Helper functions for snackbar messages
  const showSuccessMessage = useCallback((message: string) => {
    setSnackbar({
      open: true,
      type: "success",
      message,
    });
  }, []);

  const showErrorMessage = useCallback((message: string) => {
    setSnackbar({
      open: true,
      type: "error",
      message,
    });
  }, []);

  // Firebase data hooks
  const { data: schools, loading: schoolsLoading, error: schoolsError } = useFirebaseData<SchoolType>("schools", userContext.user?.uid);

  const { data: contacts, loading: contactsLoading, error: contactsError } = useFirebaseData<Contact>("contacts", userContext.user?.uid);

  const { programs, loading: programsLoading } = usePrograms();

  const {
    data: schoolProgramParticipation,
    loading: schoolProgramParticipationLoading,
    createItem: createSchoolProgramParticipation,
    updateItem: updateSchoolProgramParticipation,
    deleteItem: deleteSchoolProgramParticipation,
    error: schoolProgramParticipationError,
  } = useFirebaseData<SchoolProgramParticipation>("school-program-participation", userContext.user?.uid);

  // Create lookup maps for performance
  const lookupMaps = useMemo(() => createLookupMaps(schools || [], contacts || [], programs || []), [schools, contacts, programs]);

  // Map participations for display
  const mappedParticipations: MappedParticipation[] = useMemo(
    () =>
      mapParticipationsForDisplay(schoolProgramParticipation || [], lookupMaps.schoolsMap, lookupMaps.contactsMap, lookupMaps.programsMap),
    [schoolProgramParticipation, lookupMaps]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (data: SchoolProgramParticipationDTO) => {
      try {
        const userId = userContext.user?.uid;
        const validatedData = schoolProgramParticipationDTOSchema.parse(data);

        // Parse and validate data using Zod schema

        await createSchoolProgramParticipation(validatedData);
        showSuccessMessage(MESSAGES.SUCCESS.PARTICIPATION_ADDED);
      } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
          // Extract validation error messages
          const errorMessages = (error as any).issues.map((issue: any) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
          showErrorMessage(`Validation error: ${errorMessages}`);
        } else {
          showErrorMessage(MESSAGES.ERROR.SAVE_FAILED);
        }
        throw error;
      }
    },
    [createSchoolProgramParticipation]
  );

  // Handle participation update
  const handleUpdateParticipation = useCallback(
    async (id: string, data: Partial<SchoolProgramParticipation>) => {
      try {
        // Validate the update data using Zod schema
        const updateData = { id, ...data };
        const validatedData = schoolProgramParticiapationUpdateDTOSchema.parse(updateData);

        await updateSchoolProgramParticipation(id, validatedData);
        showSuccessMessage(MESSAGES.SUCCESS.PARTICIPATION_UPDATED);
        onUpdate?.(id, data);
      } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
          // Extract validation error messages
          const errorMessages = (error as any).issues.map((issue: any) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
          showErrorMessage(`Validation error: ${errorMessages}`);
        } else {
          showErrorMessage(MESSAGES.ERROR.UPDATE_FAILED);
        }
        throw error;
      }
    },
    [updateSchoolProgramParticipation, onUpdate]
  );

  // Handle participation deletion
  const handleDeleteParticipation = useCallback(
    async (id: string) => {
      try {
        await deleteSchoolProgramParticipation(id);
        showSuccessMessage(MESSAGES.SUCCESS.PARTICIPATION_DELETED);
        onDelete?.(id);
      } catch (error) {
        showErrorMessage(MESSAGES.ERROR.DELETE_FAILED);
        throw error;
      }
    },
    [deleteSchoolProgramParticipation, onDelete]
  );

  // Close snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ ...snackbar, open: false });
  }, [snackbar]);

  // Auto-close snackbar after duration
  React.useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar({ ...snackbar, open: false });
      }, UI_CONSTANTS.SNACKBAR_DURATION);

      return () => clearTimeout(timer);
    }
  }, [snackbar.open, snackbar]);

  // Loading state
  const isLoading = userContext.loading || schoolsLoading || contactsLoading || programsLoading;

  // Error state - exclude schoolProgramParticipationError since it's handled locally in operations
  const error = schoolsError || contactsError;

  return {
    // Data
    schools: schools || [],
    contacts: contacts || [],
    programs: programs || [],
    participations: schoolProgramParticipation || [],
    mappedParticipations,

    // Loading states
    isLoading,
    schoolProgramParticipationLoading,

    // Error states
    error,

    // Maps for performance
    lookupMaps,

    // Actions
    handleSubmit,
    handleUpdateParticipation,
    handleDeleteParticipation,

    // Snackbar
    snackbar,
    handleCloseSnackbar,
  };
};
