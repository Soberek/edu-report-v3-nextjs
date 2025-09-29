/**
 * Constants for the login module
 */

export const LOGIN_CONSTANTS = {
  // Form validation
  VALIDATION: {
    EMAIL_REQUIRED: "Email jest wymagany",
    EMAIL_INVALID: "Nieprawidłowy format email",
    PASSWORD_REQUIRED: "Hasło jest wymagane",
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MIN_LENGTH_MESSAGE: "Hasło musi mieć co najmniej 6 znaków",
  },
  
  // UI text
  TEXT: {
    TITLE: "Zaloguj się",
    SUBMIT_BUTTON: "Zaloguj",
    SUBMIT_LOADING: "Logowanie...",
    REGISTER_LINK_TEXT: "Nie masz konta?",
    REGISTER_LINK: "Zarejestruj się",
    UNKNOWN_ERROR: "Wystąpił nieznany błąd",
    ERROR_PREFIX: "Wystąpił błąd:",
    DEFAULT_LOGIN_ERROR: "Wystąpił błąd podczas logowania.",
  },

  // Form fields
  FIELDS: {
    EMAIL: {
      LABEL: "Email",
      TYPE: "email",
      AUTOCOMPLETE: "email",
    },
    PASSWORD: {
      LABEL: "Hasło",
      TYPE: "password",
      AUTOCOMPLETE: "current-password",
    },
  },

  // Routes
  ROUTES: {
    REGISTER: "/register",
    HOME: "/",
  },

  // Styling
  STYLES: {
    BACKGROUND_GRADIENT: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    PRIMARY_COLOR: "#7b1fa2",
    PAPER_ELEVATION: 6,
    BORDER_RADIUS: 3,
    MIN_WIDTH: 320,
    MAX_WIDTH: 400,
    BUTTON_PADDING_Y: 1.5,
  },
} as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
