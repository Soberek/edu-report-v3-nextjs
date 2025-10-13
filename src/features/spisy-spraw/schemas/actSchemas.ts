import { z } from "zod";

// Schema for creating a new act (case record)
export const ActCreateDTO = z.object({
  code: z.string().min(1, "Kod jest wymagany"),
  referenceNumber: z.string().min(1, "Numer referencyjny jest wymagany"),
  date: z.string().min(1, "Data jest wymagana"),
  title: z.string().min(1, "Tytuł jest wymagany"),
  startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  endDate: z.string().min(1, "Data zakończenia jest wymagana"),
  sender: z.string().min(1, "Nadawca jest wymagany"),
  comments: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

// Schema for updating an existing act
export const ActUpdateDTO = z.object({
  id: z.string(),
  code: z.string().min(1, "Kod jest wymagany"),
  referenceNumber: z.string().min(1, "Numer referencyjny jest wymagany"),
  date: z.string().min(1, "Data jest wymagana"),
  title: z.string().min(1, "Tytuł jest wymagany"),
  startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  endDate: z.string().min(1, "Data zakończenia jest wymagana"),
  sender: z.string().min(1, "Nadawca jest wymagany"),
  comments: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  createdAt: z.string(),
  userId: z.string(),
});

// Inferred types
export type ActCreate = z.infer<typeof ActCreateDTO>;
export type ActUpdate = z.infer<typeof ActUpdateDTO>;

