import { z } from "zod";

/**
 * Types of facilities that can be inspected
 */
export const FACILITY_TYPES = [
  "przedsiębiorstwa podmiotów leczniczych",
  "jednostki organizacyjne systemu oświaty",
  "jednostki organizacyjne pomocy społecznej",
  "uczelnie wyższe",
  "zakłady pracy",
  "obiekty kultury i wypoczynku",
  "lokale gastronomiczno-rozrywkowe",
  "obiekty służące obsłudze podróżnych",
  "pomieszczenia obiektów sportowych",
  "inne pomieszczenia użytku publicznego",
] as const;

export type FacilityType = (typeof FACILITY_TYPES)[number];

/**
 * Excel row structure for health inspection data
 */
export interface HealthInspectionRow {
  lp?: number | string;
  "RODZAJ OBIEKTU": string;
  "LICZBA SKONTROLOWANYCH OBIEKTÓW": number | string;
  OGÓŁEM?: number | string;
  "W TYM Z WYKORZYSTANIEM PALARNI"?: number | string;
}

/**
 * Aggregated data structure
 */
export interface AggregatedHealthData {
  [facilityType: string]: {
    skontrolowane: number;
    realizowane: number;
    zWykorzystaniemPalarni: number;
  };
}

/**
 * File upload state
 */
export interface FileUploadState {
  file: File;
  fileName: string;
  data: HealthInspectionRow[];
  status: "pending" | "processing" | "success" | "error";
  error?: string;
}

/**
 * Zod schema for validation
 */
export const HealthInspectionRowSchema = z.object({
  lp: z.union([z.number(), z.string()]).optional(),
  "RODZAJ OBIEKTU": z.string().min(1, "Rodzaj obiektu jest wymagany"),
  "LICZBA SKONTROLOWANYCH OBIEKTÓW": z
    .union([z.number(), z.string(), z.undefined(), z.null()])
    .transform((val) => {
      if (val === undefined || val === null || val === "") return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    })
    .optional()
    .default(0),
  OGÓŁEM: z
    .union([z.number(), z.string(), z.undefined(), z.null()])
    .transform((val) => {
      if (val === undefined || val === null || val === "") return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    })
    .optional()
    .default(0),
  "W TYM Z WYKORZYSTANIEM PALARNI": z
    .union([z.number(), z.string(), z.undefined(), z.null()])
    .transform((val) => {
      if (val === undefined || val === null || val === "") return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    })
    .optional()
    .default(0),
});

/**
 * Constants
 */
export const MAX_FILES = 10;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const VALID_FILE_EXTENSIONS = [".xlsx", ".xls"];

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  TOO_MANY_FILES: `Możesz wgrać maksymalnie ${MAX_FILES} plików`,
  FILE_TOO_LARGE: "Plik jest za duży (max. 10MB)",
  INVALID_FILE_TYPE: "Nieprawidłowy format pliku. Dozwolone: .xlsx, .xls",
  INVALID_DATA_FORMAT: "Nieprawidłowy format danych w pliku Excel",
  NO_DATA: "Plik nie zawiera danych",
  PROCESSING_ERROR: "Błąd podczas przetwarzania pliku",
};
