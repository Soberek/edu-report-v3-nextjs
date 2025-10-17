import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";

/**
 * Filter schema for task listing and search
 */
export const filterSchema = z.object({
  programIds: z.array(z.string()).default([]),
  taskTypeId: z.string().default(""),
  month: z.string().default(""),
  status: z.string().default(""),
  search: z.string().default(""),
  year: z.string().default(""),
});

/**
 * Schema for creating a new task
 */
export const createTaskSchema = z.object({
  taskTypeId: z.string().min(1, VALIDATION_MESSAGES.common.required),
  programId: z.string().min(1, VALIDATION_MESSAGES.common.required),
  description: z.string().min(1, VALIDATION_MESSAGES.task.description),
  dueDate: z.string().min(1, VALIDATION_MESSAGES.task.dueDate),
  completedDate: z.string().optional(),
  status: z.enum(["pending", "completed"]).default("pending"),
  userId: z.string().min(1, VALIDATION_MESSAGES.common.required),
});

/**
 * Schema for editing an existing task
 */
export const editTaskSchema = createTaskSchema.extend({
  id: z.string().min(1, VALIDATION_MESSAGES.common.required),
});

// Export types inferred from schemas
export type FilterFormData = z.infer<typeof filterSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type EditTaskFormData = z.infer<typeof editTaskSchema>;