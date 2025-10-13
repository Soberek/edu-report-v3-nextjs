import { SHARED_AUTH_CONSTANTS } from "@/features/auth";

/**
 * Login-specific constants that extend shared auth constants
 */
export const LOGIN_CONSTANTS = {
  // Inherit shared validation
  VALIDATION: SHARED_AUTH_CONSTANTS.VALIDATION,

  // Login-specific UI text
  TEXT: {
    ...SHARED_AUTH_CONSTANTS.TEXT,
    TITLE: "Zaloguj się",
    SUBMIT_BUTTON: "Zaloguj",
    SUBMIT_LOADING: "Logowanie...",
    REGISTER_LINK_TEXT: "Nie masz konta?",
    REGISTER_LINK: "Zarejestruj się",
    DEFAULT_LOGIN_ERROR: "Wystąpił błąd podczas logowania.",
  },

  // Login-specific form fields
  FIELDS: {
    ...SHARED_AUTH_CONSTANTS.FIELDS,
    PASSWORD: {
      ...SHARED_AUTH_CONSTANTS.FIELDS.PASSWORD,
      AUTOCOMPLETE: "current-password",
    },
  },

  // Inherit shared routes and styles
  ROUTES: SHARED_AUTH_CONSTANTS.ROUTES,
  STYLES: SHARED_AUTH_CONSTANTS.STYLES,
} as const;

// Re-export shared regex
export { EMAIL_REGEX } from "@/features/auth";
