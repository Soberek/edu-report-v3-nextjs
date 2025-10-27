import { useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useNotification } from "@/hooks";
import {
  Contact,
  ContactCreateDTO,
  ContactCreateSchema,
  UseContactsReturn,
} from "../types";
import { useContacts as useContactsQuery, useCreateContact, useUpdateContact, useDeleteContact } from "../api";

/**
 * Custom hook for managing contacts with TanStack Query
 * Handles CRUD operations with automatic error notifications via useQueryWithNotifications
 *
 * @example
 * const { data: contacts, isPending, error, createContact, updateContact, deleteContact } = useContacts();
 */
export const useContacts = (): UseContactsReturn => {
  const userContext = useUser();
  const { showError } = useNotification();
  const userId = userContext.user?.uid;

  // Queries
  const { data, isPending, error, refetch } = useContactsQuery(userId);

  // Mutations
  const createMutation = useCreateContact(userId);
  const updateMutation = useUpdateContact(userId);
  const deleteMutation = useDeleteContact(userId);

  const createContact = useCallback(
    async (contactData: ContactCreateDTO): Promise<Contact | null> => {
      try {
        // Validate data using Zod schema
        const validatedData = ContactCreateSchema.parse(contactData);
        const result = await createMutation.mutateAsync(validatedData);
        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Nie udało się utworzyć kontaktu";
        showError(errorMsg);
        return null;
      }
    },
    [createMutation, showError]
  );

  const updateContact = useCallback(
    async (id: string, contactData: ContactCreateDTO): Promise<boolean> => {
      try {
        // Validate data using Zod schema
        const validatedData = ContactCreateSchema.parse(contactData);
        await updateMutation.mutateAsync({ id, data: validatedData });
        return true;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Nie udało się zaktualizować kontaktu";
        showError(errorMsg);
        return false;
      }
    },
    [updateMutation, showError]
  );

  const deleteContact = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteMutation.mutateAsync(id);
        return true;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Nie udało się usunąć kontaktu";
        showError(errorMsg);
        return false;
      }
    },
    [deleteMutation, showError]
  );

  return {
    data: data || [],
    loading: isPending || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: error instanceof Error ? error.message : null,
    refetch,
    createContact,
    updateContact,
    deleteContact,
  };
};

// Re-export types for backward compatibility
export type { Contact, ContactCreateDTO };

