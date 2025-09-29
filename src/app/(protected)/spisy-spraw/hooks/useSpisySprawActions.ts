import { useCallback } from "react";
import { useAct } from "@/hooks/useAct";
import { createActsOptions } from "../constants";
import { MESSAGES } from "../constants";
import { actions } from "../reducers/spisySprawReducer";
import type { SpisySprawState, SpisySprawAction } from "../types";
import type { CaseRecord } from "@/types";

export interface UseSpisySprawActionsProps {
  state: SpisySprawState;
  dispatch: React.Dispatch<SpisySprawAction>;
  formRef: React.RefObject<{ submit: () => void }>;
  reset: () => void;
}

export const useSpisySprawActions = ({ state, dispatch, formRef, reset }: UseSpisySprawActionsProps) => {
  const { addActRecord, removeActRecord, updateActRecord } = useAct();
  const actsOptions = createActsOptions();

  // Act CRUD operations
  const handleAddActRecord = useCallback(
    async (data: CaseRecord) => {
      try {
        await addActRecord(data);
        dispatch(
          actions.showSnackbar({
            type: "success",
            message: MESSAGES.ADD_SUCCESS,
          })
        );
        reset();
      } catch (error) {
        dispatch(
          actions.showSnackbar({
            type: "error",
            message: MESSAGES.ADD_ERROR,
          })
        );
      }
    },
    [addActRecord, dispatch, reset]
  );

  const handleDeleteCaseRecord = useCallback(
    async (caseId: string) => {
      try {
        await removeActRecord(caseId);
        dispatch(
          actions.showSnackbar({
            type: "success",
            message: MESSAGES.DELETE_SUCCESS,
          })
        );
      } catch (error) {
        dispatch(
          actions.showSnackbar({
            type: "error",
            message: MESSAGES.DELETE_ERROR,
          })
        );
      }
    },
    [removeActRecord, dispatch]
  );

  const handleFormSubmit = useCallback(
    async (data: CaseRecord) => {
      if (state.editingCaseRecord) {
        dispatch(actions.setDialogLoading(true));
        try {
          await updateActRecord(data);
          dispatch(
            actions.showSnackbar({
              type: "success",
              message: MESSAGES.UPDATE_SUCCESS,
            })
          );
          dispatch(actions.closeEditDialog());
        } catch (error) {
          dispatch(
            actions.showSnackbar({
              type: "error",
              message: MESSAGES.UPDATE_ERROR,
            })
          );
        } finally {
          dispatch(actions.setDialogLoading(false));
        }
      }
    },
    [state.editingCaseRecord, updateActRecord, dispatch]
  );

  // UI actions
  const handleEditCaseRecord = useCallback(
    (caseRecord: CaseRecord) => {
      dispatch(actions.startEdit(caseRecord));
    },
    [dispatch]
  );

  const handleSaveCaseRecord = useCallback(async () => {
    if (formRef.current && formRef.current.submit) {
      await formRef.current.submit();
    }
  }, [formRef]);

  const handleCloseEditDialog = useCallback(() => {
    dispatch(actions.closeEditDialog());
  }, [dispatch]);

  const handleCloseSnackbar = useCallback(() => {
    dispatch(actions.closeSnackbar());
  }, [dispatch]);

  const handleCodeChange = useCallback(
    (code: string) => {
      const option = actsOptions.find((opt) => opt.code === code);
      dispatch(
        actions.setSelectedCode({
          code,
          title: option?.name || "",
        })
      );
    },
    [actsOptions, dispatch]
  );

  return {
    // CRUD operations
    handleAddActRecord,
    handleDeleteCaseRecord,
    handleFormSubmit,
    handleEditCaseRecord,
    handleSaveCaseRecord,

    // UI actions
    handleCloseEditDialog,
    handleCloseSnackbar,
    handleCodeChange,

    // Data
    actsOptions,
    actsOptionsCodes: actsOptions.map((option) => option.code),
  };
};
