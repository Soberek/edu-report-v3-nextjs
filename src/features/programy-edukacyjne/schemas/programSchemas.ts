import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/constants";

/** Schema for creating a new educational program */
export const createProgramSchema = z.object({
  code: z.string().min(1, VALIDATION_MESSAGES.program.code),
  name: z.string().min(1, VALIDATION_MESSAGES.program.name),
  programType: z.enum(["programowy", "nieprogramowy"], {
    message: VALIDATION_MESSAGES.program.programType,
  }),
  description: z.string().min(1, VALIDATION_MESSAGES.program.description),
});

/** Schema for editing an existing program */
export const editProgramSchema = createProgramSchema.extend({
  id: z.string(),
});

/** Inferred types for type safety */
export type CreateProgramFormData = z.infer<typeof createProgramSchema>;
export type EditProgramFormData = z.infer<typeof editProgramSchema>;

