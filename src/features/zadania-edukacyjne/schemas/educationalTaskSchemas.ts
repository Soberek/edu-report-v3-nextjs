import { z } from "zod";

// Activity schemas
const audienceGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nazwa grupy jest wymagana"),
  type: z.enum(["dzieci", "młodzież", "dorośli", "seniorzy"]),
  count: z.number().min(1, "Liczba uczestników musi być większa niż 0"),
});

const activitySchema = z.object({
  type: z.enum([
    "presentation",
    "lecture",
    "workshop",
    "distribution",
    "media_publication",
    "educational_info_stand",
    "report",
    "monthly_report",
    "intent_letter",
    "visitation",
    "games",
    "instruction",
    "individual_instruction",
    "meeting",
    "training",
    "conference",
    "counseling",
    "contest",
    "street_happening",
    "other"
  ]),
  title: z.string().min(1, "Tytuł aktywności jest wymagany"),
  description: z.string().optional(),
  actionCount: z.number().min(1, "Liczba działań musi być większa niż 0").optional(),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj przynajmniej jedną grupę odbiorców").optional(),
});

// Main form schema
export const createEducationalTaskSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  programName: z.string().min(1, "Nazwa programu jest wymagana"),
  date: z.string().min(1, "Data jest wymagana"),
  schoolId: z.string().min(1, "Szkoła jest wymagana"),
  taskNumber: z.string().min(1, "Numer zadania jest wymagany"),
  referenceNumber: z.string().min(1, "Numer referencyjny jest wymagany"),
  referenceId: z.string().optional(),
  activities: z.array(activitySchema).min(1, "Dodaj przynajmniej jedną aktywność"),
});

export const editEducationalTaskSchema = createEducationalTaskSchema.extend({
  id: z.string(),
});

// Export types inferred from schemas
export type CreateEducationalTaskFormData = z.infer<typeof createEducationalTaskSchema>;
export type EditEducationalTaskFormData = z.infer<typeof editEducationalTaskSchema>;
export type ActivityFormData = z.infer<typeof activitySchema>;
export type AudienceGroupFormData = z.infer<typeof audienceGroupSchema>;

