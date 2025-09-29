import { z } from "zod";
import { TASK_TYPES } from "@/constants/tasks";
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
  distributedCount: z.number().min(1, "Ilość musi być co najmniej 1").max(10000, "Ilość nie może przekraczać 10000"),
  description: z.string().optional(),
});

// Schema dla grup odbiorców
const audienceGroupSchema = z.object({
  id: z.string().min(1, "ID grupy jest wymagane"),
  name: z.string().min(1, "Nazwa grupy jest wymagana").max(50, "Nazwa grupy nie może być dłuższa niż 50 znaków"),
  type: z.enum(["dorośli", "młodzież", "dzieci", "seniorzy"], {
    message: "Wybierz prawidłowy typ odbiorcy",
  }),
  count: z.number().min(1, "Liczba osób musi być większa od 0").max(1000, "Maksymalnie 1000 osób"),
});

const activitySchema = z
  .object({
    type: z.enum(Object.values(TASK_TYPES).map((taskType) => taskType.label) as [string, ...string[]]),
    title: z.string().min(1, "Tytuł aktywności jest wymagany").max(200, "Tytuł nie może być dłuższy niż 200 znaków"),
    actionCount: z.number().min(1, "Ilość działań musi być co najmniej 1").max(100, "Ilość działań nie może przekraczać 100").default(1),
    audienceCount: z.number().min(0, "Liczba odbiorców nie może być ujemna").max(10000, "Liczba odbiorców nie może przekraczać 10000"),
    description: z.string().min(1, "Opis jest wymagany").max(1000, "Opis nie może być dłuższy niż 1000 znaków"),
    audienceGroups: z.array(audienceGroupSchema).optional().default([]),
    media: mediaSchema.optional(),
    materials: z.array(materialSchema).optional(),
  })
  .refine(
    (data) => {
      // If type is "publikacja media", media is required
      if (data.type === "publikacja media" && !data.media) {
        return false;
      }
      // If type is not "publikacja media", media should not be present
      if (data.type !== "publikacja media" && data.media) {
        return false;
      }
      // If type is "dystrybucja", materials are required
      if (data.type === "dystrybucja" && (!data.materials || data.materials.length === 0)) {
        return false;
      }
      // If type is not "dystrybucja", materials should not be present
      if (data.type !== "dystrybucja" && data.materials) {
        return false;
      }
      return true;
    },
    {
      message:
        "Publikacja media wymaga informacji o mediach, dystrybucja wymaga materiałów, inne typy aktywności nie powinny mieć tych informacji",
      path: ["media", "materials"],
    }
  );

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
