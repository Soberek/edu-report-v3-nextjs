import { useMemo, useCallback } from "react";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";
import type { CaseRecord } from "@/types";

// Local imports - organized by domain
import { ActCreateDTO, ActUpdateDTO, type ActCreate } from "../schemas";
import { filterRecordsByCode, sortRecordsByDate, handleValidationError, formatErrorMessages } from "../utils";
import { ActService } from "../lib";
import { createActsOptions, MESSAGES } from "../constants";
import { actions } from "../reducers/spisySprawReducer";
import type { SpisySprawState, SpisySprawAction } from "../types";

// ============================================================================
// HOOK INTERFACE
// ============================================================================

export interface UseSpisySprawProps {
  state: SpisySprawState;
  dispatch: React.Dispatch<SpisySprawAction>;
  formRef: React.RefObject<{ submit: () => void; isDirty: boolean } | null>;
  reset: () => void;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useSpisySpraw = ({ state, dispatch, formRef, reset }: UseSpisySprawProps) => {
  // --------------------------------------------------------------------------
  // Core Dependencies
  // --------------------------------------------------------------------------

  const user = useUser();
  const userId = user.user?.uid;

  const {
    data: actRecords,
    error: actRecordsError,
    loading: actRecordsLoading,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = useFirebaseData<CaseRecord>("case-records", userId);

  // Business logic service
  const actService = useMemo(
    () =>
      new ActService({
        userId,
        createItem,
        updateItem,
        deleteItem,
        refetch,
      }),
    [userId, createItem, updateItem, deleteItem, refetch]
  );

  // --------------------------------------------------------------------------
  // Computed Data
  // --------------------------------------------------------------------------

  const actsOptions = useMemo(() => createActsOptions(), []);

  const actsOptionsCodes = useMemo(() => actsOptions.map((option) => option.code), [actsOptions]);

  const sortedCaseRecords = useMemo(() => {
    const filtered = filterRecordsByCode(actRecords, state.selectedCode.code);
    return sortRecordsByDate(filtered);
  }, [actRecords, state.selectedCode.code]);

  const errorMessages = useMemo(() => formatErrorMessages(actRecordsError), [actRecordsError]);

  // --------------------------------------------------------------------------
  // CRUD Operations
  // --------------------------------------------------------------------------

  /**
   * Creates a new act record
   */
  const handleAddActRecord = useCallback(
    async (data: CaseRecord) => {
      if (!userId) {
        dispatch(
          actions.showSnackbar({
            type: "error",
            message: "User not authenticated",
          })
        );
        return;
      }

      dispatch(actions.setCreateLoading(true));

      try {
        const parsedData = ActCreateDTO.parse(data);
        await actService.create(parsedData);

        dispatch(
          actions.showSnackbar({
            type: "success",
            message: MESSAGES.ADD_SUCCESS,
          })
        );
        reset();
      } catch (error) {
        handleValidationError(error, dispatch, MESSAGES.ADD_ERROR);
      } finally {
        dispatch(actions.setCreateLoading(false));
      }
    },
    [userId, actService, dispatch, reset]
  );

  /**
   * Updates an existing act record
   */
  const handleUpdateActRecord = useCallback(
    async (data: CaseRecord) => {
      if (!state.editingCaseRecord) return;

      if (!userId) {
        dispatch(
          actions.showSnackbar({
            type: "error",
            message: "User not authenticated",
          })
        );
        return;
      }

      dispatch(actions.setDialogLoading(true));

      try {
        const parsedData = ActUpdateDTO.parse(data);
        await actService.update(parsedData);

        dispatch(
          actions.showSnackbar({
            type: "success",
            message: MESSAGES.UPDATE_SUCCESS,
          })
        );
        dispatch(actions.closeEditDialog());
      } catch (error) {
        handleValidationError(error, dispatch, MESSAGES.UPDATE_ERROR);
      } finally {
        dispatch(actions.setDialogLoading(false));
      }
    },
    [state.editingCaseRecord, userId, actService, dispatch]
  );

  /**
   * Deletes an act record
   */
  const handleDeleteActRecord = useCallback(
    async (caseId: string) => {
      try {
        await actService.delete(caseId);

        dispatch(
          actions.showSnackbar({
            type: "success",
            message: MESSAGES.DELETE_SUCCESS,
          })
        );
      } catch {
        dispatch(
          actions.showSnackbar({
            type: "error",
            message: MESSAGES.DELETE_ERROR,
          })
        );
      }
    },
    [actService, dispatch]
  );

  // --------------------------------------------------------------------------
  // UI Actions
  // --------------------------------------------------------------------------

  /**
   * Opens create dialog
   */
  const handleOpenCreateDialog = useCallback(() => {
    dispatch(actions.openCreateDialog());
  }, [dispatch]);

  /**
   * Closes create dialog
   */
  const handleCloseCreateDialog = useCallback(() => {
    dispatch(actions.closeCreateDialog());
    reset();
  }, [dispatch, reset]);

  /**
   * Opens edit dialog for a case record
   */
  const handleEditCaseRecord = useCallback(
    (caseRecord: CaseRecord) => {
      dispatch(actions.startEdit(caseRecord));
    },
    [dispatch]
  );

  /**
   * Opens delete confirmation dialog
   */
  const handleOpenDeleteDialog = useCallback(
    (id: string) => {
      dispatch(actions.openDeleteDialog(id));
    },
    [dispatch]
  );

  /**
   * Closes delete dialog
   */
  const handleCloseDeleteDialog = useCallback(() => {
    dispatch(actions.closeDeleteDialog());
  }, [dispatch]);

  /**
   * Confirms deletion
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!state.recordToDelete) return;
    
    await handleDeleteActRecord(state.recordToDelete);
    dispatch(actions.closeDeleteDialog());
  }, [state.recordToDelete, handleDeleteActRecord, dispatch]);

  /**
   * Triggers form submission via ref
   */
  const handleSaveActRecord = useCallback(async () => {
    if (formRef.current?.submit) {
      await formRef.current.submit();
    }
  }, [formRef]);

  /**
   * Closes the edit dialog
   */
  const handleCloseEditDialog = useCallback(() => {
    dispatch(actions.closeEditDialog());
  }, [dispatch]);

  /**
   * Closes the snackbar notification
   */
  const handleCloseSnackbar = useCallback(() => {
    dispatch(actions.closeSnackbar());
  }, [dispatch]);

  /**
   * Handles code filter change
   */
  const handleCodeChange = useCallback(
    (code: string) => {
      const option = actsOptions.find((opt) => opt.code === code);
      dispatch(
        actions.setSelectedCode({
          code,
          title: option?.name || "Wszystkie",
        })
      );
    },
    [actsOptions, dispatch]
  );

  // --------------------------------------------------------------------------
  // Return Interface
  // --------------------------------------------------------------------------

  return {
    // Data
    actRecords,
    actsOptions,
    actsOptionsCodes,
    sortedCaseRecords,
    errorMessages,

    // Loading states
    isLoading: actRecordsLoading,
    hasError: !!actRecordsError,
    createLoading: state.createLoading,

    // CRUD operations
    addActRecord: handleAddActRecord,
    updateActRecord: handleUpdateActRecord,
    deleteActRecord: handleDeleteActRecord,

    // UI actions
    openCreateDialog: handleOpenCreateDialog,
    closeCreateDialog: handleCloseCreateDialog,
    editCaseRecord: handleEditCaseRecord,
    openDeleteDialog: handleOpenDeleteDialog,
    closeDeleteDialog: handleCloseDeleteDialog,
    confirmDelete: handleConfirmDelete,
    saveCaseRecord: handleSaveActRecord,
    closeEditDialog: handleCloseEditDialog,
    closeSnackbar: handleCloseSnackbar,
    changeCode: handleCodeChange,
  };
};
