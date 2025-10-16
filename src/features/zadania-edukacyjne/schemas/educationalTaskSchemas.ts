import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";

/**
 * Audience group schema - defines a group of people for activities
 */
const audienceGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, VALIDATION_MESSAGES.common.required),
  type: z.enum(["dzieci", "młodzież", "dorośli", "seniorzy"]),
  count: z.number().min(1, VALIDATION_MESSAGES.common.minValue(1)),
});

/**
 * Activity schema - represents a single educational activity
 */
const activitySchema = z.object({
  type: z.enum([
    "presentation",
    "lecture",
    "workshop",
    "distribution",
    "media_publication",
    "educational_info_stand",
    "report",
    "monthly_report",
    "intent_letter",
    "visitation",
    "games",
    "instruction",
    "individual_instruction",
    "meeting",
    "training",
    "conference",
    "counseling",
    "contest",
    "street_happening",
    "other"
  ]),
  title: z.string().min(1, VALIDATION_MESSAGES.common.required),
  description: z.string().optional(),
  actionCount: z.number().min(1, VALIDATION_MESSAGES.common.minValue(1)).optional(),
  audienceGroups: z.array(audienceGroupSchema).min(1, VALIDATION_MESSAGES.common.required).optional(),
});

/**
 * Schema for creating a new educational task
 * Includes validation for all required fields and nested objects
 */
export const createEducationalTaskSchema = z.object({
  title: z.string().min(1, VALIDATION_MESSAGES.common.required),
  programName: z.string().min(1, VALIDATION_MESSAGES.program.name),
  date: z.string().min(1, VALIDATION_MESSAGES.common.required),
  schoolId: z.string().min(1, VALIDATION_MESSAGES.common.required),
  taskNumber: z.string().min(1, VALIDATION_MESSAGES.task.title),
  referenceNumber: z.string().min(1, VALIDATION_MESSAGES.act.referenceNumber),
  referenceId: z.string().optional(),
  activities: z.array(activitySchema).min(1, VALIDATION_MESSAGES.common.required),
});

/**
 * Schema for editing an existing educational task
 * Extends create schema with required ID field
 */
export const editEducationalTaskSchema = createEducationalTaskSchema.extend({
  id: z.string(),
});

// Export types inferred from schemas
export type CreateEducationalTaskFormData = z.infer<typeof createEducationalTaskSchema>;
export type EditEducationalTaskFormData = z.infer<typeof editEducationalTaskSchema>;
export type ActivityFormData = z.infer<typeof activitySchema>;
export type AudienceGroupFormData = z.infer<typeof audienceGroupSchema>;