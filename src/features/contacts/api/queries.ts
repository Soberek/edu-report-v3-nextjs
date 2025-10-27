/**
 * React Query hooks for fetching contacts
 * Uses useQueryWithNotifications for automatic error handling and notifications
 */

import { useQueryWithNotifications } from '@/hooks/useQueryWithNotifications';
import { FirebaseService } from '@/services/firebaseService';
import { Contact, ContactSchema } from '../types';
import { contactKeys } from './keys';

const contactsService = new FirebaseService<Contact>('contacts');

/**
 * Fetch all contacts for current user
 * Automatically shows error notifications on failure
 */
export function useContacts(userId?: string) {
  return useQueryWithNotifications<Contact[]>(
    {
      queryKey: contactKeys.list(userId),
      queryFn: async () => {
        if (!userId) return [];
        const data = await contactsService.getDocumentsByUserId(userId);
        return data.map((contact) => ContactSchema.parse(contact));
      },
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    'contacts'
  );
}

/**
 * Fetch single contact by ID
 */
export function useContact(id: string) {
  return useQueryWithNotifications<Contact>(
    {
      queryKey: contactKeys.detail(id),
      queryFn: async () => {
        const contact = await contactsService.getDocumentById(id);
        if (!contact) throw new Error('Contact not found');
        return ContactSchema.parse(contact);
      },
      enabled: !!id,
    },
    `contact-${id}`
  );
}
