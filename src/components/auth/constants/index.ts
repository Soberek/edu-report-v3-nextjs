/**
 * Shared constants for authentication modules
 */

export const SHARED_AUTH_CONSTANTS = {
  // Common validation messages
  VALIDATION: {
    EMAIL_REQUIRED: "Email jest wymagany",
    EMAIL_INVALID: "Nieprawidłowy format email",
    PASSWORD_REQUIRED: "Hasło jest wymagane",
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MIN_LENGTH_MESSAGE: "Hasło musi mieć co najmniej 6 znaków",
  },

  // Common UI text
  TEXT: {
    UNKNOWN_ERROR: "Wystąpił nieznany błąd",
    ERROR_PREFIX: "Wystąpił błąd:",
    DEFAULT_ERROR_TITLE: "Błąd",
  },

  // Common form fields
  FIELDS: {
    EMAIL: {
      LABEL: "Email",
      TYPE: "email" as const,
      AUTOCOMPLETE: "email",
    },
    PASSWORD: {
      LABEL: "Hasło",
      TYPE: "password" as const,
    },
  },

  // Common routes
  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
  },

  // Common styling
  STYLES: {
    BACKGROUND_GRADIENT: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    PRIMARY_COLOR: "#7b1fa2",
    PAPER_ELEVATION: 6,
    BORDER_RADIUS: 3,
    MIN_WIDTH: 320,
    MAX_WIDTH: 400,
    BUTTON_PADDING_Y: 1.5,
    FORM_GAP: 2,
    COMPONENT_GAP: 3,
  },

  // Animation timings
  ANIMATIONS: {
    ERROR_COLLAPSE_TIMEOUT: 300,
  },
} as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
