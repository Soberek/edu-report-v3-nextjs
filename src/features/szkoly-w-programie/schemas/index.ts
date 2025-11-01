/**
 * Centralized Zod schemas for the Szkoły w Programie feature.
 * All external data validation happens here.
 */

export {
  participationSchema,
  participationCreateSchema,
  participationUpdateSchema,
  type Participation,
  type ParticipationCreate,
  type ParticipationUpdate,
} from './participation.schema'
