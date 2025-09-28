import { z } from "zod";

export const createProgramSchema = z.object({
  code: z.string().min(1, "Kod jest wymagany").max(50, "Kod nie może być dłuższy niż 50 znaków"),
  name: z.string().min(1, "Nazwa jest wymagana").max(200, "Nazwa nie może być dłuższa niż 200 znaków"),
  programType: z.enum(["programowy", "nieprogramowy"], {
    required_error: "Typ programu jest wymagany",
  }),
  description: z.string().min(1, "Opis jest wymagany").max(1000, "Opis nie może być dłuższy niż 1000 znaków"),
});

export const editProgramSchema = createProgramSchema.extend({
  id: z.string().min(1, "ID jest wymagane"),
});

export type CreateProgramFormData = z.infer<typeof createProgramSchema>;
export type EditProgramFormData = z.infer<typeof editProgramSchema>;
