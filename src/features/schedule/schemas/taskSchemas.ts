import { z } from "zod";

// Filter schema
export const filterSchema = z.object({
  programIds: z.array(z.string()).default([]),
  taskTypeId: z.string().default(""),
  month: z.string().default(""),
  status: z.string().default(""),
  search: z.string().default(""),
  year: z.string().default(""),
});

// Task schemas
export const createTaskSchema = z.object({
  taskTypeId: z.string().min(1, "Typ zadania jest wymagany"),
  programId: z.string().min(1, "Program jest wymagany"),
  description: z.string().min(1, "Opis jest wymagany"),
  dueDate: z.string().min(1, "Data wykonania jest wymagana"),
  completedDate: z.string().optional(),
  status: z.enum(["pending", "completed"]).default("pending"),
  userId: z.string().min(1, "ID użytkownika jest wymagane"),
});

export const editTaskSchema = createTaskSchema.extend({
  id: z.string().min(1, "ID zadania jest wymagane"),
});

export type FilterFormData = z.infer<typeof filterSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type EditTaskFormData = z.infer<typeof editTaskSchema>;

