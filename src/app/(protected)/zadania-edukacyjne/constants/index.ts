// UI Constants
export const UI_CONSTANTS = {
  CONTAINER_MAX_WIDTH: "xl" as const,
  SNACKBAR_DURATION: 4000, // 4 seconds
  TABLE_HEIGHT: 600,
  FORM_GRID_MIN_WIDTH: 300,
  PAGE_SIZE_OPTIONS: [5, 10, 25] as const,
} as const;

// Page Constants
export const PAGE_CONSTANTS = {
  TITLE: "Zadania edukacyjne",
  SUBTITLE: "Zarządzaj zadaniami edukacyjnymi i ich aktywnościami",
  ADD_TASK_BUTTON: "Dodaj zadanie",
  FILTERS_TITLE: "Filtry",
  EMPTY_STATE: {
    NO_TASKS: "Brak zadań edukacyjnych",
    NO_FILTERED_TASKS: "Brak zadań spełniających kryteria filtrowania",
    NO_TASKS_DESCRIPTION: "Dodaj pierwsze zadanie edukacyjne, aby rozpocząć.",
    NO_FILTERED_DESCRIPTION: "Spróbuj zmienić filtry lub dodaj nowe zadanie.",
  },
  GROUP_HEADER: {
    TASKS_COUNT: "zadań",
  },
} as const;

// Filter Constants
export const FILTER_CONSTANTS = {
  ALL_OPTION: "Wszystkie",
  YEAR_LABEL: "Rok",
  MONTH_LABEL: "Miesiąc",
  PROGRAM_LABEL: "Program",
  ACTIVITY_TYPE_LABEL: "Typ aktywności",
  MIN_WIDTH: 120,
  SELECT_WIDTHS: {
    YEAR: 120,
    MONTH: 120,
    PROGRAM: 200,
    ACTIVITY_TYPE: 150,
  },
  ACTIVE_FILTERS: {
    YEAR: "Rok",
    MONTH: "Miesiąc",
    PROGRAM: "Program",
    ACTIVITY_TYPE: "Aktywność",
  },
} as const;

// Form Constants
export const FORM_CONSTANTS = {
  CREATE_MODE: "create" as const,
  EDIT_MODE: "edit" as const,
  MIN_WIDTH: 120,
  SELECT_WIDTHS: {
    YEAR: 120,
    MONTH: 120,
    PROGRAM: 200,
    ACTIVITY_TYPE: 150,
  },
} as const;

// Button Labels
export const BUTTON_LABELS = {
  ADD_TASK: "Dodaj zadanie",
  EDIT: "Edytuj",
  DELETE: "Usuń",
  SAVE: "Zapisz",
  CANCEL: "Anuluj",
  CONFIRM: "Potwierdź",
} as const;

// Message Constants
export const MESSAGES = {
  SUCCESS: {
    TASK_CREATED: "Zadanie edukacyjne zostało utworzone pomyślnie.",
    TASK_UPDATED: "Zadanie edukacyjne zostało zaktualizowane pomyślnie.",
    TASK_DELETED: "Zadanie edukacyjne zostało usunięte pomyślnie.",
  },
  ERROR: {
    LOAD_FAILED: "Błąd podczas ładowania zadań edukacyjnych.",
    SAVE_FAILED: "Błąd podczas zapisywania zadania.",
    UPDATE_FAILED: "Błąd podczas aktualizacji zadania.",
    DELETE_FAILED: "Błąd podczas usuwania zadania.",
    VALIDATION_ERROR: "Proszę poprawić błędy w formularzu.",
  },
  CONFIRMATION: {
    DELETE_TITLE: "Usuń zadanie edukacyjne",
    DELETE_MESSAGE: "Czy na pewno chcesz usunąć to zadanie edukacyjne? Ta operacja nie może zostać cofnięta.",
    DELETE_ACTION: "delete",
  },
  LOADING: {
    LOADING_TASKS: "Ładowanie zadań edukacyjnych...",
    SAVING: "Zapisywanie...",
    UPDATING: "Aktualizowanie...",
    DELETING: "Usuwanie...",
  },
} as const;

// Validation Constants
export const VALIDATION_LIMITS = {
  MIN_YEAR: 2020,
  MAX_YEAR: 2030,
  TASK_DESCRIPTION_MAX_LENGTH: 2000,
  ACTIVITY_DESCRIPTION_MAX_LENGTH: 1000,
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
    BACKGROUND_FILTER: "grey.50",
    HEADER_BACKGROUND: "primary.main",
    TEXT_PRIMARY: "text.primary",
    TEXT_SECONDARY: "text.secondary",
  },
  GRADIENTS: {
    PRIMARY: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
    PRIMARY_HOVER: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
    SUCCESS: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
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

// Animation Constants
export const ANIMATION_CONSTANTS = {
  FADE_TIMEOUT: 300,
  EXPAND_TRANSITION: "all 0.3s ease-in-out",
} as const;
