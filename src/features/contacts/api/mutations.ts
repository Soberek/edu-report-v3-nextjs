/**
 * React Query mutations for contacts CRUD operations
 * Handles create, update, delete with automatic UI updates via optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGlobalNotification } from '@/providers/NotificationProvider';
import { FirebaseService } from '@/services/firebaseService';
import { Contact, ContactCreateDTO } from '../types';
import { contactKeys } from './keys';

const contactsService = new FirebaseService<Contact>('contacts');

/**
 * Create new contact
 * Invalidates list query to refetch data
 */
export function useCreateContact(userId?: string) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useGlobalNotification();

  return useMutation({
    mutationFn: async (data: ContactCreateDTO) => {
      if (!userId) throw new Error('User not authenticated');
      // API returns string ID, need to fetch full contact
      const contactId = await contactsService.createDocument(userId, data);
      const newContact = await contactsService.getDocumentById(contactId);
      if (!newContact) throw new Error('Failed to fetch created contact');
      return newContact;
    },
    onSuccess: (newContact: Contact) => {
      // Update query cache with new contact
      queryClient.setQueryData(contactKeys.detail(newContact.id), newContact);
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: contactKeys.list(userId) });
      showSuccess('Kontakt dodany pomyślnie');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Nie udało się dodać kontaktu';
      showError(`Błąd: ${message}`);
    },
  });
}

/**
 * Update existing contact
 * Uses optimistic update for better UX
 */
export function useUpdateContact(userId?: string) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useGlobalNotification();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ContactCreateDTO;
    }) => {
      return await contactsService.updateDocument(id, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: contactKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: contactKeys.list(userId) });

      // Get previous data for rollback
      const previousContact = queryClient.getQueryData<Contact>(contactKeys.detail(id));
      const previousList = queryClient.getQueryData<Contact[]>(contactKeys.list(userId));

      // Optimistic update
      const updatedContact: Contact = {
        ...(previousContact || ({} as Contact)),
        ...data,
        id,
      };
      queryClient.setQueryData(contactKeys.detail(id), updatedContact);
      queryClient.setQueryData(
        contactKeys.list(userId),
        (old: Contact[] | undefined) =>
          old
            ? old.map((c) => (c.id === id ? updatedContact : c))
            : undefined
      );

      return { previousContact, previousList };
    },
    onSuccess: (_, { id, data }) => {
      // No refetch needed - optimistic update already applied
      // Just update with latest timestamp if server returned it
      const optimisticContact = queryClient.getQueryData<Contact>(contactKeys.detail(id));
      if (optimisticContact) {
        queryClient.setQueryData(contactKeys.detail(id), {
          ...optimisticContact,
          updatedAt: new Date().toISOString(),
        });
      }
      showSuccess('Kontakt zaktualizowany pomyślnie');
    },
    onError: (error, _, context) => {
      // Rollback optimistic update on error
      if (context?.previousContact) {
        const prevContact = context.previousContact as Contact;
        queryClient.setQueryData(contactKeys.detail(prevContact.id), prevContact);
      }
      if (context?.previousList) {
        queryClient.setQueryData(contactKeys.list(userId), context.previousList);
      }
      const message = error instanceof Error ? error.message : 'Nie udało się zaktualizować kontaktu';
      showError(`Błąd: ${message}`);
    },
  });
}

/**
 * Delete contact
 * Uses optimistic update for better UX - no refetch needed
 */
export function useDeleteContact(userId?: string) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useGlobalNotification();

  return useMutation({
    mutationFn: async (id: string) => {
      return await contactsService.deleteDocument(id);
    },
    onMutate: async (id) => {
      // Cancel outgoing queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: contactKeys.list(userId) });

      // Get previous data for rollback
      const previousContacts = queryClient.getQueryData<Contact[]>(contactKeys.list(userId));

      // Optimistic update - remove from list immediately
      queryClient.setQueryData(
        contactKeys.list(userId),
        (old: Contact[] | undefined) =>
          old ? old.filter((c) => c.id !== id) : undefined
      );

      return { previousContacts };
    },
    onSuccess: () => {
      // No refetch needed - optimistic update already applied
      showSuccess('Kontakt usunięty pomyślnie');
    },
    onError: (error, _, context) => {
      // Rollback optimistic update on error
      if (context?.previousContacts) {
        queryClient.setQueryData(contactKeys.list(userId), context.previousContacts);
      }
      const message = error instanceof Error ? error.message : 'Nie udało się usunąć kontaktu';
      showError(`Błąd: ${message}`);
    },
  });
}
