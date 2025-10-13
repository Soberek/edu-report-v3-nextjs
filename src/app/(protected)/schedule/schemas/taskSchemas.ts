import { z } from "zod";

// Base task schema
export const taskBaseSchema = z.object({
  taskTypeId: z.string().min(1, "Typ zadania jest wymagany"),
  programId: z.string().min(1, "Program jest wymagany"),
  dueDate: z.string().min(1, "Termin wykonania jest wymagany"),
  description: z.string().min(1, "Opis zadania jest wymagany").max(500, "Opis nie może przekraczać 500 znaków"),
  completedDate: z.string().optional(),
});

// Create task schema
export const createTaskSchema = taskBaseSchema.extend({
  userId: z.string().min(1, "ID użytkownika jest wymagane"),
});

// Edit task schema
export const editTaskSchema = taskBaseSchema.extend({
  id: z.string().min(1, "ID zadania jest wymagane"),
  status: z.enum(["pending", "completed"]).optional(),
});

// Filter schema
export const filterSchema = z.object({
  programIds: z.array(z.string()).default([]),
  taskTypeId: z.string().default(""),
  month: z.string().default(""),
  status: z.string().default(""),
  search: z.string().default(""),
  year: z.string().default(""),
});

// Types
export type TaskBaseFormData = z.infer<typeof taskBaseSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type EditTaskFormData = z.infer<typeof editTaskSchema>;
export type FilterFormData = z.infer<typeof filterSchema>;
