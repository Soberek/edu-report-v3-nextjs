/**
 * TanStack Query key factory for the Szkoły w Programie feature.
 * Ensures consistent, type-safe query key generation.
 *
 * @example
 * useQuery({ queryKey: participationKeys.all })
 * useQuery({ queryKey: participationKeys.list({ year: '2024/2025' }) })
 */

import type { FilterState } from '../constants/filterDefaults';

export const participationKeys = {
  /**
   * Root key for all participation queries.
   */
  all: ['participations'] as const,

  /**
   * List query key - fetches all participations.
   */
  lists: () => [...participationKeys.all, 'list'] as const,

  /**
   * Filtered list query key with optional filters.
   */
  list: (filters?: Partial<FilterState>) =>
    [...participationKeys.lists(), { filters }] as const,

  /**
   * Detail query key for a specific participation.
   */
  detail: (id: string) => [...participationKeys.all, 'detail', id] as const,

  /**
   * Statistics query key.
   */
  stats: () => [...participationKeys.all, 'stats'] as const,
};
