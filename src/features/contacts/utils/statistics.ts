/**
 * Statistics calculation utilities for contacts
 */

import { Contact } from "../types";

export interface ContactStatistics {
  total: number;
  withEmail: number;
  withPhone: number;
  recentCount: number; // added in last 7 days
}

/**
 * Calculate contact statistics
 * @param contacts - Array of contacts
 * @returns Statistics object
 */
export function calculateContactStats(contacts: Contact[]): ContactStatistics {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  return {
    total: contacts.length,
    withEmail: contacts.filter((c) => !!c.email && c.email.trim().length > 0).length,
    withPhone: contacts.filter((c) => !!c.phone && c.phone.trim().length > 0).length,
    recentCount: contacts.filter(
      (c) => new Date(c.createdAt).getTime() > sevenDaysAgo
    ).length,
  };
}

/**
 * Filter contacts by search term across multiple fields
 * @param contacts - Array of contacts to filter
 * @param searchTerm - Search term
 * @returns Filtered contacts
 */
export function searchContacts(contacts: Contact[], searchTerm: string): Contact[] {
  if (!searchTerm.trim()) return [];

  const term = searchTerm.toLowerCase();
  return contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(term) ||
      contact.lastName.toLowerCase().includes(term) ||
      (contact.email?.toLowerCase().includes(term) ?? false) ||
      (contact.phone?.includes(term) ?? false) ||
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(term)
  );
}
