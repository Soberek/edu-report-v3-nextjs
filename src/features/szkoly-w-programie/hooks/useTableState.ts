/**
 * useTableState - Manages table UI state (dialogs, editing, selection).
 * Extracted from table component to improve testability and reusability.
 */

import { useState, useCallback, useRef } from "react";
import type { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";

/**
 * Ref interface for form submission from dialogs.
 * Allows parent components to trigger form submission via ref.
 */
export interface FormRef {
  submit: () => void;
  isDirty: boolean;
}

/**
 * Hook for managing all table-related UI state.
 * Centralizes dialog, editing, and selection state into a single source of truth.
 *
 * @returns State and handler functions for table operations
 *
 * @example
 * const {
 *   editingParticipation,
 *   editDialogOpen,
 *   handleEditParticipation,
 *   handleCloseEditDialog,
 * } = useTableState();
 *
 * return (
 *   <>
 *     <button onClick={() => handleEditParticipation(data)}>Edit</button>
 *     {editDialogOpen && <EditDialog {...} />}
 *   </>
 * );
 */
export const useTableState = () => {
  const [editingParticipation, setEditingParticipation] = useState<SchoolProgramParticipation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const formRef = useRef<FormRef | null>(null);

  const handleEditParticipation = useCallback((participation: SchoolProgramParticipation) => {
    setEditingParticipation(participation);
    setEditDialogOpen(true);
  }, []);

  const handleAddParticipation = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingParticipation(null);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setAddDialogOpen(false);
  }, []);

  const handleSaveParticipation = useCallback(async () => {
    if (formRef.current?.submit) {
      await formRef.current.submit();
    }
  }, []);

  return {
    // States
    editingParticipation,
    editDialogOpen,
    addDialogOpen,
    dialogLoading,
    formRef,
    // Setters
    setEditingParticipation,
    setEditDialogOpen,
    setAddDialogOpen,
    setDialogLoading,
    // Handlers
    handleEditParticipation,
    handleAddParticipation,
    handleCloseEditDialog,
    handleCloseAddDialog,
    handleSaveParticipation,
  };
};
