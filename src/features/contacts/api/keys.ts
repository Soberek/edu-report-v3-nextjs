/**
 * Query key factory for contacts feature
 * Centralized query key management following TanStack Query best practices
 */

export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (userId?: string) => [...contactKeys.lists(), { userId }] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
} as const;
