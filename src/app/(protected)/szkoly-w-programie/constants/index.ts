// UI Constants
export const UI_CONSTANTS = {
  SNACKBAR_DURATION: 4000, // 4 seconds
  DIALOG_MAX_WIDTH: "lg" as const,
  TABLE_HEIGHT: 600,
  FORM_GRID_COLUMNS: {
    MOBILE: "1fr",
    TABLET: "repeat(auto-fit, minmax(300px, 1fr))",
  },
  PAGE_SIZE_OPTIONS: [5, 10, 25] as const,
} as const;

// School Year Constants
export const SCHOOL_YEAR_OPTIONS = ["2024/2025", "2025/2026", "2026/2027", "2027/2028"] as const;

export type SchoolYear = (typeof SCHOOL_YEAR_OPTIONS)[number];

// Message Constants
export const MESSAGES = {
  SUCCESS: {
    PARTICIPATION_ADDED: "Uczestnictwo szkoły w programie zostało dodane pomyślnie.",
    PARTICIPATION_UPDATED: "Uczestnictwo zostało zaktualizowane pomyślnie.",
    PARTICIPATION_DELETED: "Uczestnictwo zostało usunięte pomyślnie.",
  },
  ERROR: {
    LOAD_FAILED: "Wystąpił błąd podczas ładowania danych.",
    SAVE_FAILED: "Wystąpił błąd podczas zapisywania danych.",
    UPDATE_FAILED: "Wystąpił błąd podczas aktualizacji danych.",
    DELETE_FAILED: "Wystąpił błąd podczas usuwania danych.",
    VALIDATION_ERROR: "Proszę poprawić błędy w formularzu.",
  },
  CONFIRMATION: {
    DELETE_CONFIRMATION: "Czy na pewno chcesz usunąć to uczestnictwo?",
  },
  LOADING: {
    LOADING_DATA: "Ładowanie danych...",
    SAVING: "Zapisywanie...",
    UPDATING: "Aktualizowanie...",
    DELETING: "Usuwanie...",
  },
  EMPTY: {
    NO_DATA: "Brak danych",
    NO_DATA_DESCRIPTION: "Dodaj pierwsze uczestnictwo szkoły w programie",
    ERROR_TITLE: "Błąd ładowania danych",
  },
} as const;

// Field Labels
export const FIELD_LABELS = {
  SCHOOL: "Szkoła",
  PROGRAM: "Program Uczestnictwa",
  COORDINATOR: "Koordynator",
  SCHOOL_YEAR: "Rok szkolny",
  STUDENT_COUNT: "Liczba uczniów",
  PREVIOUS_COORDINATOR: "Poprzedni Koordynator (opcjonalne)",
  NOTES: "Notatki",
} as const;

// Field Placeholders
export const FIELD_PLACEHOLDERS = {
  SCHOOL: "Wybierz szkołę",
  PROGRAM: "Wybierz program",
  COORDINATOR: "Wybierz koordynatora",
  SCHOOL_YEAR: "Wybierz rok szkolny",
  STUDENT_COUNT: "Wprowadź liczbę uczniów",
  PREVIOUS_COORDINATOR: "Wybierz poprzedniego koordynatora",
  NOTES: "Opcjonalne uwagi dotyczące uczestnictwa",
} as const;

// Helper Text
export const HELPER_TEXT = {
  STUDENT_COUNT: "Wprowadź liczbę uczniów uczestniczących w programie",
  NOTES: "Opcjonalne uwagi dotyczące uczestnictwa",
} as const;

// Page Constants
export const PAGE_CONSTANTS = {
  TITLE: "Szkoły w Programie",
  SUBTITLE: "Zarządzaj uczestnictwem szkół w programach edukacyjnych",
  CONTAINER_MAX_WIDTH: "xl" as const,
  FORM_TITLE: "Dodaj nowe uczestnictwo",
  TABLE_TITLE: "Lista uczestnictwa",
} as const;

// Button Labels
export const BUTTON_LABELS = {
  SAVE_PARTICIPATION: "Zapisz uczestnictwo",
  EDIT: "Edytuj",
  DELETE: "Usuń",
  CANCEL: "Anuluj",
  CONFIRM: "Potwierdź",
} as const;

// Table Constants
export const TABLE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  COLUMN_FLEX: {
    SCHOOL: 1.5,
    PROGRAM: 1,
    COORDINATOR: 1.2,
    SCHOOL_YEAR: 0.8,
    STUDENT_COUNT: 0.8,
    NOTES: 1.5,
    CREATED_AT: 0.8,
  },
  COLUMN_MIN_WIDTH: {
    SCHOOL: 200,
    PROGRAM: 150,
    COORDINATOR: 180,
    SCHOOL_YEAR: 100,
    STUDENT_COUNT: 100,
    NOTES: 150,
    CREATED_AT: 100,
  },
} as const;

// Validation Constants
export const VALIDATION_LIMITS = {
  SCHOOL_YEAR_OPTIONS: SCHOOL_YEAR_OPTIONS,
  MIN_STUDENT_COUNT: 0,
  MAX_STUDENT_COUNT: 10000,
  NOTES_MAX_LENGTH: 1000,
} as const;

// Styling Constants
export const STYLE_CONSTANTS = {
  COLORS: {
    PRIMARY: "#1976d2",
    PRIMARY_HOVER: "#1565c0",
    SUCCESS: "#4caf50",
    ERROR: "#f44336",
    WARNING: "#ff9800",
    INFO: "#2196f3",
    BACKGROUND_GRADIENT: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    HEADER_BACKGROUND: "rgba(255,255,255,0.9)",
  },
  GRADIENTS: {
    PRIMARY: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
    PRIMARY_HOVER: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
    SUCCESS: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
    HEADER: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  BORDER_RADIUS: {
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 3,
    EXTRA_LARGE: 4,
  },
  FONT_SIZES: {
    SMALL: "0.7rem",
    MEDIUM: "0.8rem",
    LARGE: "0.9rem",
    EXTRA_LARGE: "1rem",
  },
  SPACING: {
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 3,
    EXTRA_LARGE: 4,
  },
} as const;
