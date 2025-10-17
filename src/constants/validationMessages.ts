/**
 * Centralized validation error messages for the entire application
 * Organized by feature/domain for easy i18n implementation
 */

export const VALIDATION_MESSAGES = {
  /** Common validation messages */
  common: {
    required: "To pole jest wymagane",
    email: "Nieprawidłowy adres email",
    postalCode: "Kod pocztowy musi być w formacie XX-XXX",
    invalidFormat: "Nieprawidłowy format",
    minLength: (min: number) => `Minimum ${min} znaków`,
    maxLength: (max: number) => `Maksymalnie ${max} znaków`,
    minValue: (min: number) => `Wartość musi być co najmniej ${min}`,
    maxValue: (max: number) => `Wartość nie może być większa niż ${max}`,
  },

  /** School validation messages */
  school: {
    name: "Nazwa jest wymagana",
    email: "Nieprawidłowy adres email",
    address: "Adres jest wymagany",
    city: "Miasto jest wymagane",
    postalCode: "Kod pocztowy musi być w formacie XX-XXX",
    municipality: "Gmina jest wymagana",
    type: "Wybierz przynajmniej jeden typ",
  },

  /** Act/Case record validation messages */
  act: {
    code: "Kod jest wymagany",
    referenceNumber: "Numer referencyjny jest wymagany",
    date: "Data jest wymagana",
    title: "Tytuł jest wymagany",
    startDate: "Data rozpoczęcia jest wymagana",
    endDate: "Data zakończenia jest wymagana",
    sender: "Nadawca jest wymagany",
  },

  /** Educational program validation messages */
  program: {
    code: "Kod programu jest wymagany",
    name: "Nazwa programu jest wymagana",
    programType: "Typ programu jest wymagany",
    description: "Opis programu jest wymagany",
  },

  /** Task/Schedule validation messages */
  task: {
    title: "Tytuł jest wymagany",
    description: "Opis jest wymagany",
    dueDate: "Data realizacji jest wymagana",
    status: "Status jest wymagany",
  },

  /** Authentication validation messages */
  auth: {
    email: "Nieprawidłowy adres email",
    password: "Hasło jest wymagane",
    passwordMinLength: "Hasło musi mieć co najmniej 6 znaków",
    passwordMismatch: "Hasła się nie zgadzają",
    emailExists: "Ten adres email jest już zarejestrowany",
  },

  /** File validation messages */
  file: {
    required: "Plik jest wymagany",
    tooLarge: (maxSize: string) => `Plik jest zbyt duży. Maksymalny rozmiar to ${maxSize}`,
    invalidType: (allowedTypes: string) => `Nieprawidłowy typ pliku. Dozwolone są: ${allowedTypes}`,
    toManyFiles: (maxFiles: number) => `Możesz wgrać maksymalnie ${maxFiles} plików`,
  },

  /** Form validation messages */
  form: {
    validationFailed: "Proszę poprawić błędy w formularzu",
    submissionError: "Błąd przy wysyłaniu formularza",
    success: "Formularz został wysłany",
  },
} as const;

/**
 * Field labels for consistent UI labeling
 */
export const FIELD_LABELS = {
  school: {
    name: "Nazwa szkoły",
    email: "Email",
    address: "Adres",
    city: "Miasto",
    postalCode: "Kod pocztowy",
    municipality: "Gmina",
    type: "Typ szkoły",
  },
  act: {
    code: "Kod",
    referenceNumber: "Numer referencyjny",
    date: "Data",
    title: "Tytuł",
    startDate: "Data rozpoczęcia",
    endDate: "Data zakończenia",
    sender: "Nadawca",
    comments: "Komentarze",
    notes: "Notatki",
  },
  program: {
    code: "Kod programu",
    name: "Nazwa programu",
    programType: "Typ programu",
    description: "Opis",
  },
} as const;
