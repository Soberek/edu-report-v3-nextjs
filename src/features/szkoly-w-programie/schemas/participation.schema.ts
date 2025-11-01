import { z } from 'zod';

/**
 * Validation schema for school participation data.
 * Used for form validation and API response type safety.
 */
export const participationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  schoolId: z.string().min(1, 'School ID is required'),
  programId: z.string().min(1, 'Program ID is required'),
  coordinatorId: z.string().min(1, 'Coordinator ID is required'),
  previousCoordinatorId: z.string().optional().nullable(),
  schoolYear: z.string().regex(/^\d{4}\/\d{4}$/, 'Invalid school year format'),
  studentCount: z.number().int().min(0).max(10000),
  notes: z.string().optional().default(''),
  createdAt: z.string().datetime().optional(),
  userId: z.string().min(1, 'User ID is required'),
  reportSubmitted: z.boolean().default(false),
});

/**
 * Schema for creating new participation (without ID and timestamps).
 */
export const participationCreateSchema = participationSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
});

/**
 * Schema for updating participation (all fields optional).
 */
export const participationUpdateSchema = participationSchema.partial();

/**
 * Type inference from schemas
 */
export type Participation = z.infer<typeof participationSchema>;
export type ParticipationCreate = z.infer<typeof participationCreateSchema>;
export type ParticipationUpdate = z.infer<typeof participationUpdateSchema>;
