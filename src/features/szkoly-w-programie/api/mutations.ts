/**
 * API mutations for the Szkoły w Programie feature.
 * Handles CREATE, UPDATE, DELETE operations with TanStack Query.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  participationCreateSchema,
  participationUpdateSchema,
  type ParticipationCreate,
  type ParticipationUpdate,
} from '../schemas';
import { participationKeys } from './keys';

/**
 * Creates a new participation in Firestore.
 * @throws Error if creation fails
 */
async function createParticipation(
  data: ParticipationCreate
): Promise<{ id: string }> {
  const response = await fetch('/api/participations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Failed to create participation');
  return response.json();
}

/**
 * Updates an existing participation in Firestore.
 * @throws Error if update fails
 */
async function updateParticipation(
  id: string,
  data: ParticipationUpdate
): Promise<void> {
  const response = await fetch(`/api/participations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Failed to update participation');
}

/**
 * Deletes a participation from Firestore.
 * @throws Error if deletion fails
 */
async function deleteParticipation(id: string): Promise<void> {
  const response = await fetch(`/api/participations/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete participation');
}

/**
 * Hook for creating a new participation.
 * Automatically invalidates list queries on success.
 * @example
 * const { mutate, isPending } = useCreateParticipation();
 * mutate(data, {
 *   onSuccess: () => showSuccess('Created!'),
 *   onError: (err) => showError(err.message),
 * });
 */
export function useCreateParticipation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParticipation,
    onSuccess: () => {
      // Invalidate all participation queries
      queryClient.invalidateQueries({ queryKey: participationKeys.all });
    },
  });
}

/**
 * Hook for updating a participation.
 * Invalidates both detail and list queries on success.
 * @example
 * const { mutate } = useUpdateParticipation();
 * mutate({ id: 'part-123', data: { studentCount: 50 } });
 */
export function useUpdateParticipation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ParticipationUpdate }) =>
      updateParticipation(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific and list queries
      queryClient.invalidateQueries({ queryKey: participationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: participationKeys.lists() });
    },
  });
}

/**
 * Hook for deleting a participation.
 * Invalidates list queries on success.
 * @example
 * const { mutate } = useDeleteParticipation();
 * mutate('participation-id');
 */
export function useDeleteParticipation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParticipation,
    onSuccess: () => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: participationKeys.lists() });
    },
  });
}
