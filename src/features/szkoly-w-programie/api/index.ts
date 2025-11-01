/**
 * Public API for Szkoły w Programie API layer.
 * Exports queries and mutations for data fetching and manipulation.
 */

export { participationKeys } from './keys';
export {
  useParticipations,
  useFilteredParticipations,
  useParticipation,
} from './queries';
export {
  useCreateParticipation,
  useUpdateParticipation,
  useDeleteParticipation,
} from './mutations';
