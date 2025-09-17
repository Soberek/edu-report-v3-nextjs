import z from "zod";

export const ScheduledTaskSchema = z.object({
  id: z.string(),
  taskTypeId: z.string(),
  programId: z.string(),
  description: z.string().optional(),
  dueDate: z.string(),
  completedDate: z.string().optional(),
  status: z.enum(["pending", "completed"]),
  userId: z.string(),

  // Timestamps
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// DTO for creating tasks (excludes id)
export const ScheduledTaskDTO = ScheduledTaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

// DTO for updating tasks (all fields optional except id)
export const ScheduledTaskUpdateDTO = ScheduledTaskSchema.partial().extend({
  id: z.string(),
});

export type ScheduledTaskDTOType = z.infer<typeof ScheduledTaskDTO>;
export type ScheduledTaskUpdateDTOType = z.infer<typeof ScheduledTaskUpdateDTO>;
export type ScheduledTaskType = z.infer<typeof ScheduledTaskSchema>;
