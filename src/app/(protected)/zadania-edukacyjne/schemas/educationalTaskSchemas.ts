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

// Schemas for specific activity types
const presentationActivitySchema = z.object({
  type: z.literal("presentation"),
  title: z.string().min(1, "Tytuł aktywności jest wymagany").max(200, "Tytuł nie może być dłuższy niż 200 znaków"),
  actionCount: z.coerce
    .number()
    .min(1, "Ilość działań musi być co najmniej 1")
    .max(100, "Ilość działań nie może przekraczać 100"),
  description: z.string().min(1, "Opis jest wymagany").max(1000, "Opis nie może być dłuższy niż 1000 znaków"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const distributionActivitySchema = z.object({
  type: z.literal("distribution"),
  title: z.string().min(1, "Tytuł aktywności jest wymagany").max(200, "Tytuł nie może być dłuższy niż 200 znaków"),
  description: z.string().min(1, "Opis jest wymagany").max(1000, "Opis nie może być dłuższy niż 1000 znaków"),
  materials: z.array(materialSchema).min(1, "Dodaj co najmniej jeden materiał"),
  audienceGroups: z.array(audienceGroupSchema).min(1, "Dodaj co najmniej jedną grupę odbiorców"),
});

const mediaPublicationActivitySchema = z.object({
  type: z.literal("media_publication"),
  title: z.string().min(1, "Tytuł aktywności jest wymagany").max(200, "Tytuł nie może być dłuższy niż 200 znaków"),
  description: z.string().min(1, "Opis jest wymagany").max(1000, "Opis nie może być dłuższy niż 1000 znaków"),
  media: mediaSchema,
  estimatedReach: z.coerce.number().min(1, "Szacowany zasięg musi być większy od 0").max(10000000, "Zasięg nie może przekraczać 10 milionów").optional(),
});

// Union schema for all activity types
const activitySchema = z.discriminatedUnion("type", [
  presentationActivitySchema,
  distributionActivitySchema,
  mediaPublicationActivitySchema,
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
