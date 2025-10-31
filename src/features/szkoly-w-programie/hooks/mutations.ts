
import { useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useWithNotification } from "./useWithNotification";
import { useNotification } from "@/hooks";
import { SchoolProgramParticipation, SchoolProgramParticipationDTO } from "@/types";
import { schoolProgramParticipationDTOSchema, schoolProgramParticiapationUpdateDTOSchema } from "@/models/SchoolProgramParticipation";
import { normalizeStudentCount } from "@/hooks/utils/error-handler.utils";
import { MESSAGES } from "../constants";

/**
 * Provides mutation functions (add, update, delete) for school participations.
 * Simulates `useMutation` from TanStack Query.
 */
export const useParticipationMutations = () => {
  const { user } = useUser();
  const { showError } = useNotification();
  const executeWithNotification = useWithNotification();

  // We only need the mutation functions from useFirebaseData, not the data itself.
  // Assumes that useFirebaseData is real-time or that updates will trigger a re-render.
  const {
    createItem,
    updateItem,
    deleteItem,
  } = useFirebaseData<SchoolProgramParticipation>("school-program-participation", user?.uid);

  const addParticipation = useCallback(async (data: SchoolProgramParticipationDTO) => {
    await executeWithNotification(
      async () => {
        const validatedData = schoolProgramParticipationDTOSchema.parse({
          ...data,
          studentCount: normalizeStudentCount(data.studentCount),
        });
        await createItem(validatedData);
      },
      MESSAGES.SUCCESS.PARTICIPATION_ADDED,
      MESSAGES.ERROR.SAVE_FAILED
    );
  }, [createItem, executeWithNotification]);

  const updateParticipation = useCallback(async (id: string, data: Partial<SchoolProgramParticipation>) => {
    await executeWithNotification(
      async () => {
        const validatedData = schoolProgramParticiapationUpdateDTOSchema.parse({
          ...data,
          id,
          studentCount: normalizeStudentCount(data.studentCount),
        });
        await updateItem(id, validatedData);
      },
      MESSAGES.SUCCESS.PARTICIPATION_UPDATED,
      MESSAGES.ERROR.UPDATE_FAILED
    );
  }, [updateItem, executeWithNotification]);

  const deleteParticipation = useCallback(async (id: string) => {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      showError(MESSAGES.ERROR.INVALID_ID);
      return;
    }
    await executeWithNotification(
      async () => {
        await deleteItem(id);
      },
      MESSAGES.SUCCESS.PARTICIPATION_DELETED,
      MESSAGES.ERROR.DELETE_FAILED
    );
  }, [deleteItem, showError, executeWithNotification]);

  return {
    addParticipation,
    updateParticipation,
    deleteParticipation,
  };
};
