/**
 * Constants for the registration module
 */

export const REGISTER_CONSTANTS = {
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
    TITLE: "Zarejestruj się",
    SUBMIT_BUTTON: "Zarejestruj",
    SUBMIT_LOADING: "Rejestruję...",
    LOGIN_LINK_TEXT: "Masz już konto?",
    LOGIN_LINK: "Zaloguj się",
    UNKNOWN_ERROR: "Wystąpił nieznany błąd",
    ERROR_PREFIX: "Wystąpił błąd:",
  },

  // Form fields
  FIELDS: {
    EMAIL: {
      LABEL: "Email",
      TYPE: "email",
    },
    PASSWORD: {
      LABEL: "Hasło",
      TYPE: "password",
    },
  },

  // Routes
  ROUTES: {
    LOGIN: "/login",
    HOME: "/",
  },

  // Styling
  STYLES: {
    BACKGROUND_GRADIENT: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    PRIMARY_COLOR: "#7b1fa2",
    PAPER_ELEVATION: 6,
    BORDER_RADIUS: 3,
    MIN_WIDTH: 320,
  },
} as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
