/**
 * Contacts Feature Module
 * 
 * Manages contact creation, editing, deletion, and search.
 * 
 * @example
 * import { useContacts, ContactList, ContactForm } from '@/features/contacts';
 * 
 * function ContactsPage() {
 *   const { data: contacts, loading, createContact, updateContact, deleteContact } = useContacts();
 *   return (
 *     <>
 *       <ContactForm onAddContact={createContact} />
 *       <ContactList contacts={contacts} loading={loading} />
 *     </>
 *   );
 * }
 */

// Hooks
export { useContacts } from "./hooks";
export type { UseContactsReturn } from "./types";

// Components
export { default as ContactList } from "./components/list";
export { default as ContactForm } from "./components/form";
export { default as ContactStats } from "./components/stats";
export { default as ContactSearch } from "./components/search";
export { default as ContactEditDialog } from "./components/edit-dialog";
export { default as ContactFormDialog } from "./components/contact-form-dialog";

// Types
export * from "./types";

