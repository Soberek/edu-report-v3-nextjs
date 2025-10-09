import { z } from "zod";

/**
 * Act Schema - Complete validation schema for case records
 */
export const ActSchema = z.object({
  id: z.string(),
  code: z.string().min(1, "Kod jest wymagany"),
  referenceNumber: z.string().min(1, "Numer referencyjny jest wymagany"),
  date: z.string().min(1, "Data jest wymagana"),
  title: z.string().min(1, "Tytuł jest wymagany"),
  createdAt: z.string(),
  startDate: z.string().min(1, "Data wszczęcia jest wymagana"),
  endDate: z.string().min(1, "Data zakończenia jest wymagana"),
  sender: z.string(),
  comments: z.string(),
  notes: z.string(),
  userId: z.string(),
});

/**
 * Act Create DTO - Schema for creating new records
 * Omits auto-generated fields
 */
export const ActCreateDTO = ActSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
});

/**
 * Act Update DTO - Schema for updating existing records
 * All fields optional except ID
 */
export const ActUpdateDTO = ActSchema.partial().required({ id: true });

// Type exports
export type Act = z.infer<typeof ActSchema>;
export type ActCreate = z.infer<typeof ActCreateDTO>;
export type ActUpdate = z.infer<typeof ActUpdateDTO>;
