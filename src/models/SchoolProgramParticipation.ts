import { z } from "zod";

export const schoolProgramParticipationSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  programId: z.string(),
  coordinatorId: z.string(),
  // Rozwiązanie tymczasowe
  previousCoordinatorId: z.string().optional(), // ID koordynatora z poprzedniego roku
  //
  schoolYear: z.enum(["2024/2025", "2025/2026", "2026/2027", "2027/2028"] as const),
  studentCount: z.number().int().nonnegative(),
  createdAt: z.string(),
  notes: z.string().optional(),
  userId: z.string(),
  // Czy przesłał sprawozdanie z realizacji programu?
  // Pole opcjonalne, będą się sprawozdawać na koniec roku szkolnego
  reportSubmitted: z.boolean().optional(),
});

export const schoolProgramParticipationDTOSchema = schoolProgramParticipationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const schoolProgramParticiapationUpdateDTOSchema = schoolProgramParticipationSchema.partial().extend({
  id: z.string(),
});

export type SchoolProgramParticipation = z.infer<typeof schoolProgramParticipationSchema>;
export type SchoolProgramParticipationDTO = z.infer<typeof schoolProgramParticipationDTOSchema>;
