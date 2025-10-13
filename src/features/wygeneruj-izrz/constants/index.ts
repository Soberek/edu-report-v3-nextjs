// UI Constants
export const UI_CONSTANTS = {
  SUBMIT_MESSAGE_DURATION: 5000, // 5 seconds
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  DEBOUNCE_DELAY: 300, // 300ms
} as const;

// Template Constants
export const TEMPLATE_CONSTANTS = {
  ALLOWED_FILE_TYPES: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"],
  PREDEFINED_TEMPLATES: [
    { name: "izrz.docx", label: "IZRZ Template", description: "Szablon raportu IZRZ" },
    { name: "lista_obecnosci.docx", label: "Lista Obecności", description: "Szablon listy obecności" },
  ],
} as const;

// API Constants
export const API_CONSTANTS = {
  GENERATE_IZRZ_ENDPOINT: "/api/generate-izrz",
  TEMPLATE_BASE_PATH: "/generate-templates",
} as const;

// Form Constants
export const FORM_CONSTANTS = {
  DEFAULT_DATE_FORMAT: "YYYY-MM-DD",
  TEXTAREA_ROWS: {
    MIN: 3,
    DEFAULT: 4,
    MAX: 8,
  },
  GRID_COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 2,
  },
} as const;

// Success/Error Messages
export const MESSAGES = {
  SUCCESS: {
    REPORT_GENERATED: "Raport został wygenerowany! Pobieranie rozpoczęte.",
    TEMPLATE_LOADED: "Szablon został załadowany pomyślnie.",
    FORM_RESET: "Formularz został zresetowany.",
  },
  ERROR: {
    GENERATION_FAILED: "Błąd podczas generowania raportu. Spróbuj ponownie.",
    TEMPLATE_LOAD_FAILED: "Błąd podczas ładowania szablonu.",
    NETWORK_ERROR: "Błąd połączenia. Sprawdź połączenie internetowe.",
    VALIDATION_ERROR: "Proszę poprawić błędy w formularzu.",
    FILE_TOO_LARGE: "Plik jest zbyt duży. Maksymalny rozmiar to 10MB.",
    INVALID_FILE_TYPE: "Nieprawidłowy typ pliku. Dozwolone są tylko pliki .docx",
  },
  LOADING: {
    GENERATING: "Generowanie...",
    LOADING_TEMPLATE: "Ładowanie szablonu...",
    SUBMITTING: "Przesyłanie...",
  },
} as const;

// Form Field Labels
export const FIELD_LABELS = {
  CASE_NUMBER: "Numer sprawy",
  REPORT_NUMBER: "Numer raportu",
  PROGRAM_NAME: "Nazwa programu",
  TASK_TYPE: "Typ zadania",
  ADDRESS: "Szkoła",
  DATE_INPUT: "Data",
  VIEWER_COUNT: "Liczba widzów",
  VIEWER_COUNT_DESCRIPTION: "Opis liczby widzów",
  TASK_DESCRIPTION: "Opis zadania",
  ADDITIONAL_INFO: "Dodatkowe informacje",
  ATTENDANCE_LIST: "Lista obecności",
  ROZDZIELNIK: "Rozdzielnik",
  TEMPLATE_FILE: "Szablon",
} as const;

// Form Field Placeholders
export const FIELD_PLACEHOLDERS = {
  CASE_NUMBER: "Wprowadź numer sprawy",
  REPORT_NUMBER: "Wprowadź numer raportu",
  PROGRAM_NAME: "Wybierz program",
  TASK_TYPE: "Wybierz typ zadania",
  ADDRESS: "Wybierz szkołę",
  VIEWER_COUNT: "Wprowadź liczbę widzów",
  VIEWER_COUNT_DESCRIPTION: "Opisz szczegółowo liczbę widzów",
  TASK_DESCRIPTION: "Wprowadź szczegółowy opis zadania",
  ADDITIONAL_INFO: "Wprowadź dodatkowe informacje (opcjonalne)",
} as const;

// Page Constants
export const PAGE_CONSTANTS = {
  TITLE: "📋 Generator IZRZ",
  SUBTITLE: "Generuj raporty i dokumenty edukacyjne",
  CONTAINER_MAX_WIDTH: "md",
  SPACING: {
    SECTION: 2,
    FIELD: 2,
    BUTTON: 3,
  },
} as const;

// Button Constants
export const BUTTON_CONSTANTS = {
  GENERATE_REPORT: "Generuj raport",
  GENERATING: "Generowanie...",
  RESET_FORM: "Resetuj formularz",
  CANCEL: "Anuluj",
} as const;

// Styling Constants
export const STYLE_CONSTANTS = {
  COLORS: {
    PRIMARY: "#1976d2",
    PRIMARY_HOVER: "#1565c0",
    SECONDARY: "#42a5f5",
    SUCCESS: "#4caf50",
    ERROR: "#f44336",
    WARNING: "#ff9800",
    INFO: "#2196f3",
  },
  GRADIENTS: {
    PRIMARY: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
    PRIMARY_HOVER: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
  },
  BORDER_RADIUS: {
    SMALL: 1.5,
    MEDIUM: 2,
    LARGE: 3,
  },
  FONT_SIZES: {
    SMALL: "0.8rem",
    MEDIUM: "0.9rem",
    LARGE: "1rem",
  },
} as const;
