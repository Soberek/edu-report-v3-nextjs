import { z } from "zod";

// Excel Data Types
export interface ExcelRow {
  [key: string]: string | number;
}

// Month Selection Types
export interface Month {
  monthNumber: number;
  selected: boolean;
}

// Program Data Types
export interface ProgramAction {
  people: number;
  actionNumber: number;
}

export interface ProgramData {
  [actionName: string]: ProgramAction;
}

export interface ProgramTypeData {
  [programName: string]: ProgramData;
}

export interface ProgramsData {
  [programType: string]: ProgramTypeData;
}

// Aggregated Data Types
export interface AggregatedData {
  aggregated: ProgramsData;
  allPeople: number;
  allActions: number;
}

// State Types
export interface BudgetMeterState {
  // File handling
  fileName: string;
  rawData: ExcelRow[];
  isLoading: boolean;
  fileError: string | null;
  
  // Month selection
  selectedMonths: Month[];
  monthError: string | null;
  
  // Data processing
  aggregatedData: AggregatedData | null;
  processingError: string | null;
  
  // UI state
  isProcessing: boolean;
}

// Action Types
export type BudgetMeterAction =
  | { type: "RESET_STATE" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FILE_ERROR"; payload: string | null }
  | { type: "SET_MONTH_ERROR"; payload: string | null }
  | { type: "SET_PROCESSING_ERROR"; payload: string | null }
  | { type: "SET_FILE_DATA"; payload: { fileName: string; rawData: ExcelRow[] } }
  | { type: "SET_SELECTED_MONTHS"; payload: Month[] }
  | { type: "TOGGLE_MONTH"; payload: number }
  | { type: "SET_AGGREGATED_DATA"; payload: AggregatedData }
  | { type: "SET_PROCESSING"; payload: boolean };

// Validation Schemas
export const ExcelRowSchema = z.object({
  "Typ programu": z.string().min(1, "Typ programu jest wymagany"),
  "Nazwa programu": z.string().min(1, "Nazwa programu jest wymagana"),
  "Działanie": z.string().min(1, "Działanie jest wymagane"),
  "Liczba ludzi": z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num) || num < 0) {
      throw new Error("Liczba ludzi musi być liczbą większą lub równą 0");
    }
    return num;
  }),
  "Liczba działań": z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num) || num < 0) {
      throw new Error("Liczba działań musi być liczbą większą lub równą 0");
    }
    return num;
  }),
  "Data": z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "Nieprawidłowy format daty"),
});

export const MonthSchema = z.object({
  monthNumber: z.number().min(1).max(12),
  selected: z.boolean(),
});

export const FileValidationSchema = z.object({
  name: z.string().min(1),
  type: z.string().refine((type) => 
    type.includes("spreadsheet") || type.includes("excel") || 
    type.endsWith(".xlsx") || type.endsWith(".xls"),
    "Plik musi być w formacie Excel (.xlsx lub .xls)"
  ),
  size: z.number().max(10 * 1024 * 1024, "Plik nie może być większy niż 10MB"),
});

// Constants
export const MONTH_NAMES = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
] as const;

export const VALID_FILE_EXTENSIONS = [".xlsx", ".xls"] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Error Messages
export const ERROR_MESSAGES = {
  NO_FILE_SELECTED: "Nie wybrano pliku",
  INVALID_FILE_TYPE: "Nieprawidłowy typ pliku. Wybierz plik Excel (.xlsx lub .xls)",
  FILE_TOO_LARGE: "Plik jest zbyt duży. Maksymalny rozmiar to 10MB",
  FILE_READ_ERROR: "Błąd podczas odczytu pliku",
  PROCESSING_ERROR: "Błąd podczas przetwarzania danych",
  NO_MONTHS_SELECTED: "Wybierz przynajmniej jeden miesiąc",
  INVALID_DATA_FORMAT: "Nieprawidłowy format danych w pliku Excel",
} as const;
