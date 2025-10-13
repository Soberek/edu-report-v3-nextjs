import { z } from "zod";

export const createProgramSchema = z.object({
  code: z.string().min(1, "Kod programu jest wymagany"),
  name: z.string().min(1, "Nazwa programu jest wymagana"),
  programType: z.enum(["programowy", "nieprogramowy"], {
    message: "Typ programu jest wymagany",
  }),
  description: z.string().min(1, "Opis programu jest wymagany"),
});

export const editProgramSchema = createProgramSchema.extend({
  id: z.string(),
});

export type CreateProgramFormData = z.infer<typeof createProgramSchema>;
export type EditProgramFormData = z.infer<typeof editProgramSchema>;

