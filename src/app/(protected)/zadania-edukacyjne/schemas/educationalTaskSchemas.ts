import { z } from "zod";
import { MEDIA_PLATFORMS, MATERIAL_TYPES } from "@/constants/educationalTasks";

const mediaSchema = z.object({
  title: z.string().min(1, "Tytuł publikacji jest wymagany").max(200, "Tytuł nie może być dłuższy niż 200 znaków"),
  link: z.string().url("Podaj prawidłowy URL").max(500, "Link nie może być dłuższy niż 500 znaków"),
  platform: z.enum(Object.values(MEDIA_PLATFORMS) as [string, ...string[]]),
});

const materialSchema = z.object({
  id: z.string().min(1, "ID materiału jest wymagane"),
  name: z.string().min(1, "Nazwa materiału jest wymagana").max(200, "Nazwa nie może być dłuższa niż 200 znaków"),
  type: z.enum(Object.values(MATERIAL_TYPES) as [string, ...string[]]),
  distributedCount: z.coerce.number().min(1, "Ilość musi być co najmniej 1").max(10000, "Ilość nie może przekraczać 10000"),
  description: z.string().optional(),
});

// Schema dla grup odbiorców
const audienceGroupSchema = z.object({
  id: z.string().min(1, "ID grupy jest wymagane"),
  name: z.string().min(1, "Nazwa grupy jest wymagana").max(50, "Nazwa grupy nie może być dłuższa niż 50 znaków"),
  type: z.enum(["dorośli", "młodzież", "dzieci", "seniorzy"], {
    message: "Wybierz prawidłowy typ odbiorcy",
  }),
  count: z.coerce.number().min(1, "Liczba osób musi być większa od 0").max(1000, "Maksymalnie 1000 osób"),
});

// Base activity schema with common fields
const baseActivitySchema = z.object({
  title: z.string().min(1, "Tytuł aktywności jest wymagany").max(200, "Tytuł nie może być dłuższy niż 200 znaków"),
  description: z.string().min(1, "Opis jest wymagany").max(1000, "Opis nie może być dłuższy niż 1000 znaków"),
});

// Schemas for specific activity types
const presentationActivitySchema = baseActivitySchema.extend({
  type: z.literal("presentation"),
  actionCount: z.coerce.number().min(1, "Ilość działań musi być co najmniej 1").max(100, "Ilość działań nie może przekraczać 100"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const distributionActivitySchema = baseActivitySchema.extend({
  type: z.literal("distribution"),
  materials: z.array(materialSchema).min(1, "Dodaj co najmniej jeden materiał"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const mediaPublicationActivitySchema = baseActivitySchema.extend({
  type: z.literal("media_publication"),
  media: mediaSchema,
  estimatedReach: z.coerce
    .number()
    .min(1, "Szacowany zasięg musi być większy od 0")
    .max(10000000, "Zasięg nie może przekraczać 10 milionów")
    .optional(),
});

const educationalInfoStandActivitySchema = baseActivitySchema.extend({
  type: z.literal("educational_info_stand"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const reportActivitySchema = baseActivitySchema.extend({
  type: z.literal("report"),
});

const monthlyReportActivitySchema = baseActivitySchema.extend({
  type: z.literal("monthly_report"),
});

const lectureActivitySchema = baseActivitySchema.extend({
  type: z.literal("lecture"),
  actionCount: z.coerce.number().min(1, "Ilość działań musi być co najmniej 1").max(100, "Ilość działań nie może przekraczać 100"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const intentLetterActivitySchema = baseActivitySchema.extend({
  type: z.literal("intent_letter"),
});

const visitationActivitySchema = baseActivitySchema.extend({
  type: z.literal("visitation"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const gamesActivitySchema = baseActivitySchema.extend({
  type: z.literal("games"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const instructionActivitySchema = baseActivitySchema.extend({
  type: z.literal("instruction"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const individualInstructionActivitySchema = baseActivitySchema.extend({
  type: z.literal("individual_instruction"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const meetingActivitySchema = baseActivitySchema.extend({
  type: z.literal("meeting"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const trainingActivitySchema = baseActivitySchema.extend({
  type: z.literal("training"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const conferenceActivitySchema = baseActivitySchema.extend({
  type: z.literal("conference"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const counselingActivitySchema = baseActivitySchema.extend({
  type: z.literal("counseling"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const workshopActivitySchema = baseActivitySchema.extend({
  type: z.literal("workshop"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const contestActivitySchema = baseActivitySchema.extend({
  type: z.literal("contest"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const otherActivitySchema = baseActivitySchema.extend({
  type: z.literal("other"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const streetHappeningActivitySchema = baseActivitySchema.extend({
  type: z.literal("street_happening"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

// Union schema for all activity types
const activitySchema = z.discriminatedUnion("type", [
  presentationActivitySchema,
  distributionActivitySchema,
  mediaPublicationActivitySchema,
  educationalInfoStandActivitySchema,
  reportActivitySchema,
  monthlyReportActivitySchema,
  lectureActivitySchema,
  intentLetterActivitySchema,
  visitationActivitySchema,
  gamesActivitySchema,
  instructionActivitySchema,
  individualInstructionActivitySchema,
  meetingActivitySchema,
  trainingActivitySchema,
  conferenceActivitySchema,
  counselingActivitySchema,
  workshopActivitySchema,
  contestActivitySchema,
  otherActivitySchema,
  streetHappeningActivitySchema,
]);

export const createEducationalTaskSchema = z.object({
  title: z.string().min(1, "Tytuł zadania jest wymagany").max(200, "Tytuł nie może być dłuższy niż 200 znaków"),
  programName: z.string().min(1, "Nazwa programu jest wymagana").max(200, "Nazwa programu nie może być dłuższa niż 200 znaków"),
  date: z.string().min(1, "Data jest wymagana"),
  schoolId: z.string().min(1, "Wybór szkoły jest wymagany"),
  taskNumber: z
    .string()
    .min(1, "Numer zadania jest wymagany")
    .regex(/^\d+\/\d{4}$/, "Numer zadania musi mieć format: liczba/rok (np. 45/2025)"),
  referenceNumber: z.string().min(1, "Numer referencyjny jest wymagany").max(50, "Numer referencyjny nie może być dłuższy niż 50 znaków"),
  referenceId: z.string().optional(),
  activities: z.array(activitySchema).min(1, "Dodaj co najmniej jedną aktywność"),
});

export const editEducationalTaskSchema = createEducationalTaskSchema.extend({
  id: z.string().min(1, "ID jest wymagane"),
});

export type CreateEducationalTaskFormData = z.infer<typeof createEducationalTaskSchema>;
export type EditEducationalTaskFormData = z.infer<typeof editEducationalTaskSchema>;
