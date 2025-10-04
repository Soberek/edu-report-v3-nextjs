// Export viewer description templates as an array for UI selection
export const viewerDescriptionTemplates = Object.entries(OPISY_ZADAN).map(([key, value]) => ({
  key,
  label: `${value.icon} ${key.trim()}`,
  description: value.opis,
}));
import { z } from "zod";
import { OPISY_ZADAN } from "../constants/opisy-zadan";

// Validation constants
const VALIDATION_LIMITS = {
  CASE_NUMBER_MIN_LENGTH: 1,
  CASE_NUMBER_MAX_LENGTH: 50,
  REPORT_NUMBER_MIN_LENGTH: 1,
  REPORT_NUMBER_MAX_LENGTH: 50,
  PROGRAM_NAME_MIN_LENGTH: 1,
  PROGRAM_NAME_MAX_LENGTH: 100,
  TASK_TYPE_MIN_LENGTH: 1,
  TASK_TYPE_MAX_LENGTH: 100,
  ADDRESS_MIN_LENGTH: 1,
  ADDRESS_MAX_LENGTH: 200,
  VIEWER_COUNT_MIN: 0,
  VIEWER_COUNT_MAX: 10000,
  VIEWER_DESCRIPTION_MIN_LENGTH: 1,
  VIEWER_DESCRIPTION_MAX_LENGTH: 1000,
  TASK_DESCRIPTION_MIN_LENGTH: 1,
  TASK_DESCRIPTION_MAX_LENGTH: 2000,
  ADDITIONAL_INFO_MAX_LENGTH: 1000,
} as const;

// Error messages
const ERROR_MESSAGES = {
  REQUIRED: "To pole jest wymagane",
  CASE_NUMBER: {
    REQUIRED: "Numer sprawy jest wymagany",
    TOO_SHORT: `Numer sprawy musi mieć co najmniej ${VALIDATION_LIMITS.CASE_NUMBER_MIN_LENGTH} znak`,
    TOO_LONG: `Numer sprawy nie może przekraczać ${VALIDATION_LIMITS.CASE_NUMBER_MAX_LENGTH} znaków`,
  },
  REPORT_NUMBER: {
    REQUIRED: "Numer raportu jest wymagany",
    TOO_SHORT: `Numer raportu musi mieć co najmniej ${VALIDATION_LIMITS.REPORT_NUMBER_MIN_LENGTH} znak`,
    TOO_LONG: `Numer raportu nie może przekraczać ${VALIDATION_LIMITS.REPORT_NUMBER_MAX_LENGTH} znaków`,
  },
  PROGRAM_NAME: {
    REQUIRED: "Nazwa programu jest wymagana",
    TOO_SHORT: `Nazwa programu musi mieć co najmniej ${VALIDATION_LIMITS.PROGRAM_NAME_MIN_LENGTH} znak`,
    TOO_LONG: `Nazwa programu nie może przekraczać ${VALIDATION_LIMITS.PROGRAM_NAME_MAX_LENGTH} znaków`,
  },
  TASK_TYPE: {
    REQUIRED: "Typ zadania jest wymagany",
    TOO_SHORT: `Typ zadania musi mieć co najmniej ${VALIDATION_LIMITS.TASK_TYPE_MIN_LENGTH} znak`,
    TOO_LONG: `Typ zadania nie może przekraczać ${VALIDATION_LIMITS.TASK_TYPE_MAX_LENGTH} znaków`,
  },
  ADDRESS: {
    REQUIRED: "Adres jest wymagany",
    TOO_SHORT: `Adres musi mieć co najmniej ${VALIDATION_LIMITS.ADDRESS_MIN_LENGTH} znak`,
    TOO_LONG: `Adres nie może przekraczać ${VALIDATION_LIMITS.ADDRESS_MAX_LENGTH} znaków`,
  },
  DATE: {
    REQUIRED: "Data jest wymagana",
    INVALID: "Nieprawidłowy format daty",
  },
  VIEWER_COUNT: {
    REQUIRED: "Liczba widzów jest wymagana",
    TOO_SMALL: `Liczba widzów nie może być mniejsza niż ${VALIDATION_LIMITS.VIEWER_COUNT_MIN}`,
    TOO_LARGE: `Liczba widzów nie może być większa niż ${VALIDATION_LIMITS.VIEWER_COUNT_MAX}`,
  },
  VIEWER_DESCRIPTION: {
    REQUIRED: "Opis liczby widzów jest wymagany",
    TOO_SHORT: `Opis musi mieć co najmniej ${VALIDATION_LIMITS.VIEWER_DESCRIPTION_MIN_LENGTH} znak`,
    TOO_LONG: `Opis nie może przekraczać ${VALIDATION_LIMITS.VIEWER_DESCRIPTION_MAX_LENGTH} znaków`,
  },
  TASK_DESCRIPTION: {
    REQUIRED: "Opis zadania jest wymagany",
    TOO_SHORT: `Opis zadania musi mieć co najmniej ${VALIDATION_LIMITS.TASK_DESCRIPTION_MIN_LENGTH} znak`,
    TOO_LONG: `Opis zadania nie może przekraczać ${VALIDATION_LIMITS.TASK_DESCRIPTION_MAX_LENGTH} znaków`,
  },
  ADDITIONAL_INFO: {
    TOO_LONG: `Dodatkowe informacje nie mogą przekraczać ${VALIDATION_LIMITS.ADDITIONAL_INFO_MAX_LENGTH} znaków`,
  },
  TEMPLATE_FILE: {
    INVALID_TYPE: "Nieprawidłowy typ pliku szablonu",
    TOO_LARGE: "Plik szablonu jest zbyt duży",
  },
} as const;

// Date validation helper
const dateSchema = z
  .string()
  .min(1, ERROR_MESSAGES.DATE.REQUIRED)
  .refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    },
    { message: ERROR_MESSAGES.DATE.INVALID }
  );

// File validation helper
const templateFileSchema = z
  .instanceof(File)
  .nullable()
  .optional()
  .refine(
    (file) => {
      if (!file) return true;
      const maxSize = 10 * 1024 * 1024; // 10MB
      return file.size <= maxSize;
    },
    { message: ERROR_MESSAGES.TEMPLATE_FILE.TOO_LARGE }
  )
  .refine(
    (file) => {
      if (!file) return true;
      const allowedTypes = ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
      return allowedTypes.includes(file.type);
    },
    { message: ERROR_MESSAGES.TEMPLATE_FILE.INVALID_TYPE }
  );

// Base form schema with enhanced validation
export const izrzFormSchema = z.object({
  caseNumber: z
    .string()
    .min(VALIDATION_LIMITS.CASE_NUMBER_MIN_LENGTH, ERROR_MESSAGES.CASE_NUMBER.TOO_SHORT)
    .max(VALIDATION_LIMITS.CASE_NUMBER_MAX_LENGTH, ERROR_MESSAGES.CASE_NUMBER.TOO_LONG)
    .trim(),
  reportNumber: z
    .string()
    .min(VALIDATION_LIMITS.REPORT_NUMBER_MIN_LENGTH, ERROR_MESSAGES.REPORT_NUMBER.TOO_SHORT)
    .max(VALIDATION_LIMITS.REPORT_NUMBER_MAX_LENGTH, ERROR_MESSAGES.REPORT_NUMBER.TOO_LONG)
    .trim(),
  programName: z
    .string()
    .min(VALIDATION_LIMITS.PROGRAM_NAME_MIN_LENGTH, ERROR_MESSAGES.PROGRAM_NAME.TOO_SHORT)
    .max(VALIDATION_LIMITS.PROGRAM_NAME_MAX_LENGTH, ERROR_MESSAGES.PROGRAM_NAME.TOO_LONG)
    .trim(),
  taskType: z
    .string()
    .min(VALIDATION_LIMITS.TASK_TYPE_MIN_LENGTH, ERROR_MESSAGES.TASK_TYPE.TOO_SHORT)
    .max(VALIDATION_LIMITS.TASK_TYPE_MAX_LENGTH, ERROR_MESSAGES.TASK_TYPE.TOO_LONG)
    .trim(),
  address: z
    .string()
    .min(VALIDATION_LIMITS.ADDRESS_MIN_LENGTH, ERROR_MESSAGES.ADDRESS.TOO_SHORT)
    .max(VALIDATION_LIMITS.ADDRESS_MAX_LENGTH, ERROR_MESSAGES.ADDRESS.TOO_LONG)
    .trim(),
  dateInput: dateSchema,
  viewerCount: z
    .number()
    .min(VALIDATION_LIMITS.VIEWER_COUNT_MIN, ERROR_MESSAGES.VIEWER_COUNT.TOO_SMALL)
    .max(VALIDATION_LIMITS.VIEWER_COUNT_MAX, ERROR_MESSAGES.VIEWER_COUNT.TOO_LARGE),
  viewerCountDescription: z
    .string()
    .min(VALIDATION_LIMITS.VIEWER_DESCRIPTION_MIN_LENGTH, ERROR_MESSAGES.VIEWER_DESCRIPTION.TOO_SHORT)
    .max(VALIDATION_LIMITS.VIEWER_DESCRIPTION_MAX_LENGTH, ERROR_MESSAGES.VIEWER_DESCRIPTION.TOO_LONG)
    .trim(),
  taskDescription: z
    .string()
    .min(VALIDATION_LIMITS.TASK_DESCRIPTION_MIN_LENGTH, ERROR_MESSAGES.TASK_DESCRIPTION.TOO_SHORT)
    .max(VALIDATION_LIMITS.TASK_DESCRIPTION_MAX_LENGTH, ERROR_MESSAGES.TASK_DESCRIPTION.TOO_LONG)
    .trim(),
  additionalInfo: z.string().max(VALIDATION_LIMITS.ADDITIONAL_INFO_MAX_LENGTH, ERROR_MESSAGES.ADDITIONAL_INFO.TOO_LONG).trim().optional(),
  attendanceList: z.boolean(),
  rozdzielnik: z.boolean(),
  templateFile: templateFileSchema,
});

// Template types
export const templateSchema = z.enum(["izrz.docx", "lista_obecnosci.docx"]);

// Types
export type IzrzFormData = z.infer<typeof izrzFormSchema>;
export type TemplateType = z.infer<typeof templateSchema>;

// Default values with better structure
export const defaultFormValues: IzrzFormData = {
  caseNumber: "",
  reportNumber: "",
  programName: "",
  taskType: "",
  address: "",
  dateInput: new Date().toISOString().split("T")[0],
  viewerCount: 0,
  // Default simple viewer description - will be populated by AudienceGroupBuilder
  viewerCountDescription: "Grupa I:\nUczniowie: 0 osób",
  taskDescription: "",
  additionalInfo: "",
  attendanceList: false,
  rozdzielnik: false,
  templateFile: null,
};

// Export validation constants for use in components
export { VALIDATION_LIMITS, ERROR_MESSAGES };
