import { useMemo, useCallback } from "react";
import { useNotification } from "@/hooks";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useUser } from "@/hooks/useUser";
import type { CaseRecord } from "@/types";

// Local imports - organized by domain
import { ActCreateDTO, ActUpdateDTO } from "../schemas/actSchemas";
import {
  filterRecordsByCode,
  sortRecordsByDate,
  searchRecords,
  suggestNextReferenceNumber,
  handleValidationError,
  formatErrorMessages,
} from "../utils";
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
  const { notification, showSuccess, showError, close: closeNotification } = useNotification();

  const {
    data: actRecords,
    error: actRecordsError,
    loading: actRecordsLoading,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = useFirebaseData<CaseRecord>("case-records", userId);

  // --------------------------------------------------------------------------
  // Computed Data
  // --------------------------------------------------------------------------

  const actsOptions = useMemo(() => createActsOptions(), []);

  const actsOptionsCodes = useMemo(() => actsOptions.map((option) => option.code), [actsOptions]);

  const sortedCaseRecords = useMemo(() => {
    // First filter by code
    const filtered = filterRecordsByCode(actRecords, state.selectedCode.code);
    // Then apply search
    const searched = searchRecords(filtered, state.searchQuery);
    // Finally sort by date
    return sortRecordsByDate(searched);
  }, [actRecords, state.selectedCode.code, state.searchQuery]);

  const errorMessages = useMemo(() => formatErrorMessages(actRecordsError), [actRecordsError]);

  // Statistics
  const stats = useMemo(() => {
    const total = actRecords.length;
    const byCode = actRecords.reduce((acc, record) => {
      acc[record.code] = (acc[record.code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const filtered = sortedCaseRecords.length;
    const mostUsedCode = Object.entries(byCode).sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      filtered,
      byCode,
      mostUsedCode: mostUsedCode ? { code: mostUsedCode[0], count: mostUsedCode[1] } : null,
    };
  }, [actRecords, sortedCaseRecords]);

  // Suggested next reference number
  const suggestedReferenceNumber = useMemo(() => {
    return suggestNextReferenceNumber(actRecords);
  }, [actRecords]); // --------------------------------------------------------------------------
  // CRUD Operations
  // --------------------------------------------------------------------------

  /**
   * Creates a new act record
   */
  const handleAddActRecord = useCallback(
    async (data: CaseRecord | Omit<CaseRecord, "id" | "userId" | "createdAt">) => {
      if (!userId) {
        showError("User not authenticated");
        return;
      }

      dispatch(actions.setCreateLoading(true));

      try {
        console.log("🔍 Raw form data:", data);
        const parsedData = ActCreateDTO.parse(data);
        console.log("✅ Parsed data:", parsedData);
        
        await createItem(parsedData as Omit<CaseRecord, "id" | "createdAt" | "updatedAt" | "userId">);
        await refetch();

        showSuccess(MESSAGES.ADD_SUCCESS);
        reset();
        dispatch(actions.closeCreateDialog());
      } catch (error) {
        console.error("❌ Error creating record:", error);
        handleValidationError(error, showError, MESSAGES.ADD_ERROR);
      } finally {
        dispatch(actions.setCreateLoading(false));
      }
    },
    [userId, createItem, refetch, dispatch, reset, showSuccess, showError]
  );

  /**
   * Updates an existing act record
   */
  const handleUpdateActRecord = useCallback(
    async (data: CaseRecord | Omit<CaseRecord, "id" | "createdAt" | "userId">) => {
      if (!state.editingCaseRecord) return;

      if (!userId) {
        showError("User not authenticated");
        return;
      }

      dispatch(actions.setDialogLoading(true));

      try {
        // Merge partial data with existing record data
        const fullData: CaseRecord = {
          ...state.editingCaseRecord,
          ...data,
        };

        const parsedData = ActUpdateDTO.parse(fullData);
        const { id, ...updateData } = parsedData;
        
        await updateItem(id, updateData);
        await refetch();

        showSuccess(MESSAGES.UPDATE_SUCCESS);
        dispatch(actions.closeEditDialog());
      } catch (error) {
        handleValidationError(error, showError, MESSAGES.UPDATE_ERROR);
      } finally {
        dispatch(actions.setDialogLoading(false));
      }
    },
    [state.editingCaseRecord, userId, updateItem, refetch, dispatch, showSuccess, showError]
  );

  /**
   * Deletes an act record
   */
  const handleDeleteActRecord = useCallback(
    async (caseId: string) => {
      try {
        await deleteItem(caseId);
        await refetch();

        showSuccess(MESSAGES.DELETE_SUCCESS);
      } catch {
        showError(MESSAGES.DELETE_ERROR);
      }
    },
    [deleteItem, refetch, showSuccess, showError]
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
   * Handles search query changes
   */
  const handleSearchChange = useCallback(
    (query: string) => {
      dispatch(actions.setSearchQuery(query));
    },
    [dispatch]
  );

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
    stats,
    suggestedReferenceNumber,

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
    searchChange: handleSearchChange,
    openDeleteDialog: handleOpenDeleteDialog,
    closeDeleteDialog: handleCloseDeleteDialog,
    confirmDelete: handleConfirmDelete,
    saveCaseRecord: handleSaveActRecord,
    closeEditDialog: handleCloseEditDialog,
    notification,
    closeNotification,
    changeCode: handleCodeChange,
  };
};
