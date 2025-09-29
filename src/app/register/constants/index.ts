import { SHARED_AUTH_CONSTANTS } from "@/components/auth";

/**
 * Registration-specific constants that extend shared auth constants
 */
export const REGISTER_CONSTANTS = {
  // Inherit shared validation
  VALIDATION: SHARED_AUTH_CONSTANTS.VALIDATION,
  
  // Registration-specific UI text
  TEXT: {
    ...SHARED_AUTH_CONSTANTS.TEXT,
    TITLE: "Zarejestruj się",
    SUBMIT_BUTTON: "Zarejestruj",
    SUBMIT_LOADING: "Rejestruję...",
    LOGIN_LINK_TEXT: "Masz już konto?",
    LOGIN_LINK: "Zaloguj się",
  },

  // Registration-specific form fields
  FIELDS: {
    ...SHARED_AUTH_CONSTANTS.FIELDS,
    PASSWORD: {
      ...SHARED_AUTH_CONSTANTS.FIELDS.PASSWORD,
      AUTOCOMPLETE: "new-password",
    },
  },

  // Inherit shared routes and styles
  ROUTES: SHARED_AUTH_CONSTANTS.ROUTES,
  STYLES: SHARED_AUTH_CONSTANTS.STYLES,
} as const;

// Re-export shared regex
export { EMAIL_REGEX } from "@/components/auth";
