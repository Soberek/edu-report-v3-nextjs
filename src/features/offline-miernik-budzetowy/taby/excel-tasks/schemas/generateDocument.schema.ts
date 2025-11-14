import { z } from "zod";
import moment from "moment";

/**
 * IZRZ Document Generation Form Schema
 * Validates all form fields before submission
 * - Date formats: 12+ variations (ISO, DD.MM.YYYY, etc.)
 * - Converts date to YYYY-MM-DD for API
 * - Validates participant count as non-negative integer
 */
export const generateDocumentFormSchema = z.object({
  reportNumber: z.string().min(1, "Numer raportu jest wymagany"),
  caseNumber: z.string().min(1, "Numer sprawy jest wymagany"),
  programName: z.string().min(1, "Nazwa programu jest wymagana"),
  taskType: z.string(),
  address: z.string().min(1, "Adres jest wymagany"),
  dateInput: z
    .string()
    .min(1, "Data jest wymagana")
    .refine(
      (date) => {
        const formats = [
          "YYYY-MM-DD",
          "YYYY-MM-DDTHH:mm:ss.SSSZ",
          "YYYY-MM-DDTHH:mm:ss.SSS",
          "YYYY-MM-DDTHH:mm:ssZ",
          "YYYY-MM-DDTHH:mm:ss",
          "DD/MM/YYYY",
          "DD.MM.YYYY",
          "DD-MM-YYYY",
        ];
        const m = moment(date, formats, true);
        return m.isValid();
      },
      { message: "Nieprawidłowy format daty. Użyj DD.MM.YYYY" }
    )
    .transform((date) => {
      const formats = [
        "YYYY-MM-DD",
        "YYYY-MM-DDTHH:mm:ss.SSSZ",
        "YYYY-MM-DDTHH:mm:ss.SSS",
        "YYYY-MM-DDTHH:mm:ssZ",
        "YYYY-MM-DDTHH:mm:ss",
        "DD/MM/YYYY",
        "DD.MM.YYYY",
        "DD-MM-YYYY",
      ];
      const m = moment(date, formats, true);
      return m.format("YYYY-MM-DD");
    }),
  viewerCount: z.number().int().nonnegative("Liczba ludzi musi być liczbą dodatnią"),
  viewerCountDescription: z.string(),
  taskDescription: z.string(),
  additionalInfo: z.string(),
  attendanceList: z.boolean(),
  rozdzielnik: z.boolean(),
});

/**
 * Inferred type from schema
 * Used throughout the application for type safety
 */
export type GenerateDocumentFormData = z.infer<typeof generateDocumentFormSchema>;
