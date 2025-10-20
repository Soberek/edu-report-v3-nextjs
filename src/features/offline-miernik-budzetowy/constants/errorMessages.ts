/**
 * Error Messages for Excel Upload and Processing
 * Centralized error message strings used across the feature
 */

export const ERROR_MESSAGES = {
  // File selection errors
  NO_FILE_SELECTED: "Nie wybrano pliku",

  // File validation errors
  FILE_INVALID_TYPE: "Nieprawidłowy typ pliku",
  FILE_INVALID_TYPE_HINT: "Plik ma rozszerzenie",
  FILE_INVALID_TYPE_SUGGESTION: "Wybierz plik Excel (.xlsx lub .xls)",
  FILE_TOO_LARGE: "Plik jest zbyt duży",
  FILE_TOO_LARGE_DETAILS: "Rozmiar pliku: {sizeMB}MB, maksimum: 10MB",
  FILE_TOO_LARGE_SUGGESTION: "Zmniejsz rozmiar pliku lub podziel dane na mniejsze części",
  FILE_CORRUPTED: "Plik jest uszkodzony lub nie jest prawidłowym plikiem Excel",
  FILE_CORRUPTED_SUGGESTION: "Spróbuj otworzyć plik w Microsoft Excel i zapisz go ponownie",
  FILE_READ_ERROR: "Błąd podczas odczytu pliku",

  // Data validation errors
  DATA_NO_CONTENT: "Plik nie zawiera żadnych danych",
  DATA_ONLY_HEADERS: "Plik zawiera tylko nagłówki, brak danych",
  DATA_HEADERS_DETAILS: "Wszystkie wiersze poza nagłówkiem są puste",
  DATA_ADD_ROWS_SUGGESTION: "Dodaj co najmniej jeden wiersz z danymi",
  DATA_MISSING_COLUMNS: "Plik nie zawiera wymaganych kolumn",
  DATA_MISSING_COLUMNS_DETAILS: "Brakuje kolumn: {columns}",
  DATA_MISSING_COLUMNS_SUGGESTION: "Dodaj kolumny: {missing}. Dostępne kolumny: {available}",

  // Field validation errors
  FIELD_REQUIRED: "Pole \"{columnName}\" jest wymagane lub za krótkie",
  FIELD_TOO_LONG: "Pole \"{columnName}\" zawiera zbyt dużo znaków",
  FIELD_INVALID_TYPE: "Pole \"{columnName}\" ma nieprawidłowy typ danych",
  FIELD_INVALID_DATA: "Błąd w polu \"{columnName}\"",
  FIELD_GENERIC_ERROR: "Błąd w danych",

  // Number format errors
  NUMBER_INVALID_TYPE: "Pole \"{columnName}\" musi być liczbą",
  NUMBER_RECEIVED_VALUE: "Otrzymana wartość: \"{value}\"",
  NUMBER_SUGGESTION: "Wprowadź liczbę dodatnią (np. 10, 25.5)",

  // Date format errors
  DATE_INVALID_FORMAT: "Pole \"{columnName}\" zawiera nieprawidłową datę",
  DATE_RECEIVED_VALUE: "Otrzymana wartość: \"{value}\"",
  DATE_SUGGESTION: "Użyj formatu daty: YYYY-MM-DD (np. 2025-10-20)",

  // Row validation
  ROW_NUMBER_PREFIX: "(wiersz {rowNumber})",
  COLUMN_NAME_PREFIX: "kolumna \"{columnName}\"",
  VALUE_PREFIX: "(wartość: \"{value}\")",

  // Processing errors
  PROCESSING_ERROR: "Błąd podczas przetwarzania danych",
  PROCESSING_ERROR_SUGGESTION: "Sprawdź format danych i spróbuj ponownie",
  NO_DATA_TO_PROCESS: "Brak danych do przetworzenia",
  NO_MONTHS_SELECTED: "Wybierz przynajmniej jeden miesiąc",

  // Field-specific validation errors
  PEOPLE_COUNT_MUST_BE_NUMBER: "Liczba ludzi musi być liczbą większą lub równą 0",
  ACTIONS_COUNT_MUST_BE_NUMBER: "Liczba działań musi być liczbą większą lub równą 0",
  INVALID_DATE_FORMAT: "Nieprawidłowy format daty",
} as const;

/**
 * User-friendly error message formatting utilities
 */
export const formatErrorMessage = (
  template: string,
  variables?: Record<string, string | number>
): string => {
  if (!variables) return template;

  return Object.entries(variables).reduce((message, [key, value]) => {
    return message.replace(new RegExp(`{${key}}`, "g"), String(value));
  }, template);
};

/**
 * Build detailed error message with context
 */
export const buildDetailedErrorMessage = (
  message: string,
  options?: {
    rowNumber?: number;
    columnName?: string;
    value?: string | number;
    details?: string;
    suggestion?: string;
  }
): string => {
  let fullMessage = message;

  if (options?.rowNumber) {
    fullMessage += ` ${formatErrorMessage(ERROR_MESSAGES.ROW_NUMBER_PREFIX, { rowNumber: options.rowNumber })}`;
  }

  if (options?.columnName) {
    fullMessage += ` - ${formatErrorMessage(ERROR_MESSAGES.COLUMN_NAME_PREFIX, { columnName: options.columnName })}`;
  }

  if (options?.value !== undefined) {
    fullMessage += ` ${formatErrorMessage(ERROR_MESSAGES.VALUE_PREFIX, { value: options.value })}`;
  }

  if (options?.details) {
    fullMessage += `. ${options.details}`;
  }

  if (options?.suggestion) {
    fullMessage += `. Porada: ${options.suggestion}`;
  }

  return fullMessage;
};
