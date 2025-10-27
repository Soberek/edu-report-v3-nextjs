/**
 * Contacts Feature - Complete Type System
 * 
 * This module defines all types, schemas, and interfaces for the contacts feature.
 * Types are organized into logical sections:
 * - Zod Schemas: Validation and type inference
 * - Domain Types: Core contact data structures
 * - State Management: Redux-like state types
 * - Hook Returns: Public API types
 * - Component Props: UI component interfaces
 */

import { z } from "zod";

// ============================================================================
// ZODE SCHEMAS - Validation & Type Inference
// ============================================================================
// Used to validate data at boundaries (form submissions, API responses)
// and infer TypeScript types automatically

const ContactBaseSchema = z.object({
  firstName: z.string().min(1, "Imię jest wymagane").trim(),
  lastName: z.string().min(1, "Nazwisko jest wymagane").trim(),
  email: z.string().email("Nieprawidłowy format email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export const ContactSchema = ContactBaseSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const ContactCreateSchema = ContactBaseSchema;

// ============================================================================
// DOMAIN TYPES
// ============================================================================
// Core contact data structures inferred from Zod schemas

/** Full contact record from database */
export type Contact = z.infer<typeof ContactSchema>;

/** Data transfer object for creating contacts */
export type ContactCreateDTO = z.infer<typeof ContactCreateSchema>;

/** Normalized form data matching DTO */
export type ContactFormData = ContactCreateDTO;

// ============================================================================
// STATE MANAGEMENT TYPES
// ============================================================================
// Types for useReducer state and actions (discriminated union pattern)

export interface ContactsState {
  data: Contact[];
  loading: boolean;
  error: string | null;
}

export type ContactsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DATA"; payload: Contact[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_CONTACT"; payload: Contact }
  | { type: "UPDATE_CONTACT"; payload: Contact }
  | { type: "DELETE_CONTACT"; payload: string }
  | { type: "CLEAR_ERROR" };

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================
// Public API types returned from useContacts hook

export interface UseContactsReturn extends ContactsState {
  refetch: () => Promise<unknown>;
  createContact: (data: ContactCreateDTO) => Promise<Contact | null>;
  updateContact: (id: string, data: ContactCreateDTO) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================
// Interfaces for all component props (descriptive and required-aware)

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  loading?: boolean;
  initialData?: ContactFormData;
}

export interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
}

export interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
}

export interface ContactAvatarProps {
  firstName: string;
  lastName: string;
  size?: "small" | "medium" | "large";
}

// ============================================================================
// UTILITY TYPES
// ============================================================================
// Types used by utility functions and business logic

export interface ContactStats {
  total: number;
  withEmail: number;
  withPhone: number;
  recent: number; // added in last 7 days
}
