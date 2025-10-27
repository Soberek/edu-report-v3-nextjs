/**
 * Custom hook for contact CRUD operations
 * Handles create, update, delete operations with proper error handling
 */

import { useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useCreateContact, useUpdateContact, useDeleteContact } from "../api";
import { useNotification } from "@/hooks";
import type { ContactFormData } from "../types";

export function useContactOperations() {
  const userContext = useUser();
  const userId = userContext.user?.uid;

  const createMutation = useCreateContact(userId);
  const updateMutation = useUpdateContact(userId);
  const deleteMutation = useDeleteContact(userId);

  const { showError } = useNotification();

  const handleCreate = useCallback(
    async (data: ContactFormData): Promise<boolean> => {
      try {
        await createMutation.mutateAsync(data);
        return true;
      } catch (error) {
        console.error("Error creating contact:", error);
        return false;
      }
    },
    [createMutation]
  );

  const handleUpdate = useCallback(
    async (id: string, data: ContactFormData): Promise<boolean> => {
      try {
        await updateMutation.mutateAsync({ id, data });
        return true;
      } catch (error) {
        console.error("Error updating contact:", error);
        showError("Nie udało się zaktualizować kontaktu");
        return false;
      }
    },
    [updateMutation, showError]
  );

  const handleDelete = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteMutation.mutateAsync(id);
        return true;
      } catch (error) {
        console.error("Error deleting contact:", error);
        showError("Nie udało się usunąć kontaktu");
        return false;
      }
    },
    [deleteMutation, showError]
  );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}