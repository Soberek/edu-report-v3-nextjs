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
  aggregated: ProgramsData; // All activities (both PROGRAMOWE and NIEPROGRAMOWE)
  allPeople: number;
  allActions: number;
  warnings?: string[]; // Optional warnings (e.g., non-program rows filtered out)
  indicators?: Record<string, unknown>; // Indicator calculation results (e.g., vaccination stats, obesity prevention, etc.)
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
  Działanie: z.string().min(1, "Działanie jest wymagane"),
  "Liczba ludzi": z.union([z.string(), z.number()]).transform((val) => {
    // Handle empty strings as 0
    if (val === "" || val === 0) return 0;
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num) || num < 0) {
      throw new Error("Liczba ludzi musi być równa lub większa niż 0"); // Will be caught and formatted with constants
    }
    return num;
  }),
  "Liczba działań": z.union([z.string(), z.number()]).transform((val) => {
    // Handle empty strings as 0
    if (val === "" || val === 0) return 0;
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num) || num < 0) {
      throw new Error("Liczba działań musi być równa lub większa niż 0"); // Will be caught and formatted with constants
    }
    return num;
  }),
  Data: z.string().refine((date) => {
    // Allow empty dates for filtering later
    if (date === "") return true;
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "Nieprawidłowy format daty"), // Keep Polish message for validation
});

export const MonthSchema = z.object({
  monthNumber: z.number().min(1).max(12),
  selected: z.boolean(),
});

export const FileValidationSchema = z.object({
  name: z.string().min(1),
  type: z.string().refine(
    (type) => type.includes("spreadsheet") || type.includes("excel") || type.endsWith(".xlsx"),
    "File must be Excel format (.xlsx)" // Will be caught and formatted with constants
  ),
  size: z.number().max(10 * 1024 * 1024, "File cannot be larger than 10MB"), // Will be caught and formatted with constants
});

// Constants
export const MONTH_NAMES = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
] as const;

export const VALID_FILE_EXTENSIONS = [".xlsx", ".xls"] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Error Messages - Use from constants/errorMessages.ts
// Re-export for backward compatibility
export { ERROR_MESSAGES } from "../constants";
