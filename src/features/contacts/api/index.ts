/**
 * Contacts API - Query hooks and mutation hooks
 * Clean separation of data fetching and mutations from UI components
 */

export { contactKeys } from './keys';
export { useContacts, useContact } from './queries';
export { useCreateContact, useUpdateContact, useDeleteContact } from './mutations';
