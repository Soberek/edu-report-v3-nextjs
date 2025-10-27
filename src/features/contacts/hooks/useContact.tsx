import { useCallback, useReducer, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useNotification } from "@/hooks";
import {
  Contact,
  ContactCreateDTO,
  ContactCreateSchema,
  UseContactsReturn,
} from "../types";
import { contactsReducer, initialState } from "../reducers";

/**
 * Custom hook for managing contacts
 * Handles CRUD operations, validation, and notifications
 *
 * @example
 * const { contacts, loading, error, createContact, updateContact, deleteContact } = useContacts();
 */
export const useContacts = (): UseContactsReturn => {
  const [state, dispatch] = useReducer(contactsReducer, initialState);
  const userContext = useUser();
  const { showSuccess, showError } = useNotification();
  const userId = userContext.user?.uid;

  const {
    data: firebaseContacts,
    loading: firebaseLoading,
    error: firebaseError,
    createItem,
    deleteItem,
    updateItem,
    refetch,
  } = useFirebaseData<Contact>("contacts", userId);

  // ========================================================================
  // Sync Firebase data to local state
  // ========================================================================

  useEffect(() => {
    if (!firebaseLoading) {
      dispatch({ type: "SET_DATA", payload: firebaseContacts });
    }
  }, [firebaseContacts, firebaseLoading]);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: firebaseLoading });
  }, [firebaseLoading]);

  useEffect(() => {
    if (firebaseError) {
      dispatch({ type: "SET_ERROR", payload: firebaseError });
    }
  }, [firebaseError]);

  // ========================================================================
  // Action handlers with validation
  // ========================================================================

  const createContact = useCallback(
    async (contactData: ContactCreateDTO): Promise<Contact | null> => {
      try {
        dispatch({ type: "CLEAR_ERROR" });

        // Validate data using Zod schema
        const validatedData = ContactCreateSchema.parse(contactData);

        if (!userId) {
          const errorMsg = "User not authenticated";
          dispatch({ type: "SET_ERROR", payload: errorMsg });
          showError("Nie jesteś zalogowany");
          return null;
        }

        const newContact = await createItem(validatedData);
        showSuccess("Kontakt dodany pomyślnie");
        return newContact;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to create contact";
        dispatch({ type: "SET_ERROR", payload: errorMsg });
        showError("Nie udało się utworzyć kontaktu");
        return null;
      }
    },
    [userId, createItem, showSuccess, showError]
  );

  const updateContact = useCallback(
    async (id: string, contactData: ContactCreateDTO): Promise<boolean> => {
      try {
        dispatch({ type: "CLEAR_ERROR" });

        // Validate data using Zod schema
        const validatedData = ContactCreateSchema.parse(contactData);

        const success = await updateItem(id, validatedData);

        if (success) {
          // Update local state with the updated contact
          const updatedContact = { ...contactData, id } as Contact;
          dispatch({ type: "UPDATE_CONTACT", payload: updatedContact });
          showSuccess("Kontakt zaktualizowany pomyślnie");
        } else {
          showError("Nie udało się zaktualizować kontaktu");
        }

        return success;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to update contact";
        dispatch({ type: "SET_ERROR", payload: errorMsg });
        showError("Nie udało się zaktualizować kontaktu");
        return false;
      }
    },
    [updateItem, showSuccess, showError]
  );

  const deleteContact = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        dispatch({ type: "CLEAR_ERROR" });

        const success = await deleteItem(id);

        if (success) {
          dispatch({ type: "DELETE_CONTACT", payload: id });
          showSuccess("Kontakt usunięty pomyślnie");
        } else {
          showError("Nie udało się usunąć kontaktu");
        }

        return success;
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to delete contact";
        dispatch({ type: "SET_ERROR", payload: errorMsg });
        showError("Nie udało się usunąć kontaktu");
        return false;
      }
    },
    [deleteItem, showSuccess, showError]
  );

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
    createContact,
    updateContact,
    deleteContact,
  };
};

// Re-export types for backward compatibility
export type { Contact, ContactCreateDTO };
