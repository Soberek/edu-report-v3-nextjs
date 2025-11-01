/**
 * Query Key Factory - Centralized query key management
 * Prevents hardcoded strings and improves cache invalidation
 * 
 * Usage:
 * - queryKeys.schoolsByUser(userId) → proper hierarchy
 * - Can invalidate all schools with queryKeys.schools()
 * - Can invalidate specific user's schools with queryKeys.schoolsByUser(userId)
 */

export const queryKeys = {
  // Root key for entire feature
  all: ["participation-feature"] as const,
  
  // Schools queries
  schools: () => [...queryKeys.all, "schools"] as const,
  schoolsAll: () => [...queryKeys.schools(), "all"] as const,
  schoolsByUser: (uid: string) => [...queryKeys.schools(), uid] as const,
  
  // Contacts queries
  contacts: () => [...queryKeys.all, "contacts"] as const,
  contactsAll: () => [...queryKeys.contacts(), "all"] as const,
  contactsByUser: (uid: string) => [...queryKeys.contacts(), uid] as const,
  
  // Programs queries
  programs: () => [...queryKeys.all, "programs"] as const,
  programsAll: () => [...queryKeys.programs(), "all"] as const,
  programsByUser: (uid: string) => [...queryKeys.programs(), uid] as const,
  
  // Participations queries
  participations: () => [...queryKeys.all, "participations"] as const,
  participationsAll: () => [...queryKeys.participations(), "all"] as const,
  participationsByUser: (uid: string) => [...queryKeys.participations(), uid] as const,
  participationsByYear: (uid: string, year: string) => [...queryKeys.participationsByUser(uid), year] as const,
} as const;

/**
 * Collection names - Single source of truth for Firebase collections
 */
export const COLLECTIONS = {
  SCHOOLS: "schools",
  CONTACTS: "contacts",
  PROGRAMS: "programs",
  PARTICIPATIONS: "school-program-participation",
} as const;

export type Collection = typeof COLLECTIONS[keyof typeof COLLECTIONS];
