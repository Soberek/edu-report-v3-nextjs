/**
 * API queries for the Szkoły w Programie feature.
 * Wraps Firestore queries with TanStack Query.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { participationSchema, type Participation } from '../schemas';
import { participationKeys } from './keys';
import type { FilterState } from '../constants/filterDefaults';

/**
 * Fetches all participations from Firestore.
 * @throws Error if fetch fails
 */
async function fetchParticipations(): Promise<Participation[]> {
  try {
    const response = await fetch('/api/participations');
    if (!response.ok) throw new Error('Failed to fetch participations');

    const data = await response.json();
    // Validate with Zod schema
    return participationSchema.array().parse(data);
  } catch (error) {
    console.error('Error fetching participations:', error);
    throw error;
  }
}

/**
 * Fetches filtered participations based on filter criteria.
 * @param filters - Optional filter state (year, program, search, etc)
 */
async function fetchFilteredParticipations(
  filters?: Partial<FilterState>
): Promise<Participation[]> {
  const params = new URLSearchParams();
  if (filters?.schoolYear) params.append('year', filters.schoolYear);
  if (filters?.program) params.append('program', filters.program);
  if (filters?.search) params.append('search', filters.search);

  const response = await fetch(`/api/participations?${params}`);
  if (!response.ok) throw new Error('Failed to fetch filtered participations');

  const data = await response.json();
  return participationSchema.array().parse(data);
}

/**
 * Hook to fetch all participations.
 * @example
 * const { data, isLoading, error } = useParticipations();
 */
export function useParticipations() {
  return useQuery({
    queryKey: participationKeys.all,
    queryFn: fetchParticipations,
  });
}

/**
 * Hook to fetch filtered participations.
 * @example
 * const { data } = useFilteredParticipations({ year: '2024/2025' });
 */
export function useFilteredParticipations(filters?: Partial<FilterState>) {
  return useQuery({
    queryKey: participationKeys.list(filters),
    queryFn: () => fetchFilteredParticipations(filters),
    enabled: !!filters?.schoolYear, // Only fetch if year is selected
  });
}

/**
 * Hook to fetch a single participation by ID.
 * @example
 * const { data } = useParticipation('participation-id');
 */
export function useParticipation(id: string) {
  return useQuery({
    queryKey: participationKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/participations/${id}`);
      if (!response.ok) throw new Error('Failed to fetch participation');
      const data = await response.json();
      return participationSchema.parse(data);
    },
    enabled: !!id,
  });
}
