
import { useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useNotification } from "@/hooks";
import { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "@/types";
import { schoolProgramParticipationDTOSchema, schoolProgramParticiapationUpdateDTOSchema } from "@/models/SchoolProgramParticipation";
import { getErrorMessage, normalizeStudentCount } from "@/hooks/utils/error-handler.utils";
import { MESSAGES } from "../constants";

/**
 * Provides mutation functions (add, update, delete) for school participations.
 * Simulates `useMutation` from TanStack Query.
 */
export const useParticipationMutations = () => {
  const { user } = useUser();
  const { showSuccess, showError } = useNotification();

  // We only need the mutation functions from useFirebaseData, not the data itself.
  // Assumes that useFirebaseData is real-time or that updates will trigger a re-render.
  const {
    createItem,
    updateItem,
    deleteItem,
  } = useFirebaseData<SchoolProgramParticipation>("school-program-participation", user?.uid);

  const addParticipation = useCallback(async (data: SchoolProgramParticipationDTO) => {
    try {
      const validatedData = schoolProgramParticipationDTOSchema.parse({
        ...data,
        studentCount: normalizeStudentCount(data.studentCount),
      });
      await createItem(validatedData);
      showSuccess(MESSAGES.SUCCESS.PARTICIPATION_ADDED);
    } catch (error) {
      const errorMessage = getErrorMessage(error, MESSAGES.ERROR.SAVE_FAILED);
      showError(errorMessage);
      throw error; // Re-throw for the component to handle if needed
    }
  }, [createItem, showSuccess, showError]);

  const updateParticipation = useCallback(async (id: string, data: Partial<SchoolProgramParticipation>) => {
    try {
      const validatedData = schoolProgramParticiapationUpdateDTOSchema.parse({
        ...data,
        id,
        studentCount: normalizeStudentCount(data.studentCount),
      });
      await updateItem(id, validatedData);
      showSuccess(MESSAGES.SUCCESS.PARTICIPATION_UPDATED);
    } catch (error) {
      const errorMessage = getErrorMessage(error, MESSAGES.ERROR.UPDATE_FAILED);
      showError(errorMessage);
      throw error;
    }
  }, [updateItem, showSuccess, showError]);

  const deleteParticipation = useCallback(async (id: string) => {
    try {
      await deleteItem(id);
      showSuccess(MESSAGES.SUCCESS.PARTICIPATION_DELETED);
    } catch (error) {
      showError(MESSAGES.ERROR.DELETE_FAILED);
      throw error;
    }
  }, [deleteItem, showSuccess, showError]);

  return {
    addParticipation,
    updateParticipation,
    deleteParticipation,
  };
};
