/**
 * Detailed error handling for Excel file validation and processing
 * Provides specific, actionable error messages to users
 */

import { z } from "zod";
import { ERROR_MESSAGES, buildDetailedErrorMessage, formatErrorMessage } from "../constants";

export enum ExcelErrorType {
  // File errors
  NO_FILE = "NO_FILE",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  FILE_READ_ERROR = "FILE_READ_ERROR",
  FILE_CORRUPTED = "FILE_CORRUPTED",

  // Structure errors
  NO_DATA = "NO_DATA",
  EMPTY_DATA = "EMPTY_DATA",
  MISSING_COLUMNS = "MISSING_COLUMNS",
  EMPTY_ROWS = "EMPTY_ROWS",

  // Data validation errors
  INVALID_COLUMN_DATA = "INVALID_COLUMN_DATA",
  INVALID_NUMBER_FORMAT = "INVALID_NUMBER_FORMAT",
  INVALID_DATE_FORMAT = "INVALID_DATE_FORMAT",
  INVALID_MONTH = "INVALID_MONTH",

  // Processing errors
  NO_MONTHS_SELECTED = "NO_MONTHS_SELECTED",
  PROCESSING_FAILED = "PROCESSING_FAILED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface DetailedExcelError {
  type: ExcelErrorType;
  message: string;
  details?: string;
  rowNumber?: number;
  columnName?: string;
  value?: string | number;
  suggestion?: string;
}

/**
 * Generates detailed error messages based on error type and context
 */
export const getDetailedErrorMessage = (error: DetailedExcelError): string => {
  const { type, message, details, rowNumber, columnName, value, suggestion } = error;

  return buildDetailedErrorMessage(message, {
    rowNumber,
    columnName,
    value,
    details,
    suggestion,
  });
};

/**
 * Maps validation errors to detailed error objects
 */
export const parseZodError = (
  error: z.ZodError,
  rowNumber?: number
): DetailedExcelError => {
  const issue = error.issues[0];
  if (!issue) {
    return {
      type: ExcelErrorType.INVALID_COLUMN_DATA,
      message: ERROR_MESSAGES.FIELD_GENERIC_ERROR,
      details: "Nie można określić konkretnego błędu",
    };
  }

  const columnName = String(issue.path[0]) || "nieznana";
  const code = issue.code;

  switch (code) {
    case "too_small":
      return {
        type: ExcelErrorType.INVALID_COLUMN_DATA,
        message: formatErrorMessage(ERROR_MESSAGES.FIELD_REQUIRED, { columnName }),
        columnName,
        rowNumber,
        details: issue.message,
        suggestion: "Upewnij się, że pole zawiera wartość",
      };

    case "too_big":
      return {
        type: ExcelErrorType.INVALID_COLUMN_DATA,
        message: formatErrorMessage(ERROR_MESSAGES.FIELD_TOO_LONG, { columnName }),
        columnName,
        rowNumber,
        details: issue.message,
        suggestion: "Skróć tekst w tym polu",
      };

    case "invalid_type":
      return {
        type: ExcelErrorType.INVALID_NUMBER_FORMAT,
        message: formatErrorMessage(ERROR_MESSAGES.FIELD_INVALID_TYPE, { columnName }),
        columnName,
        rowNumber,
        details: `Otrzymano: ${issue.message}`,
        suggestion: ERROR_MESSAGES.FIELD_INVALID_DATA,
      };

    default:
      return {
        type: ExcelErrorType.INVALID_COLUMN_DATA,
        message: formatErrorMessage(ERROR_MESSAGES.FIELD_INVALID_DATA, { columnName }),
        columnName,
        rowNumber,
        details: issue.message,
        suggestion: "Sprawdź format i zawartość tego pola",
      };
  }
};

/**
 * Creates specific error for invalid number format
 */
export const createNumberFormatError = (
  columnName: string,
  value: unknown,
  rowNumber?: number
): DetailedExcelError => {
  const valueStr = String(value);
  return {
    type: ExcelErrorType.INVALID_NUMBER_FORMAT,
    message: formatErrorMessage(ERROR_MESSAGES.NUMBER_INVALID_TYPE, { columnName }),
    columnName,
    value: valueStr,
    rowNumber,
    details: formatErrorMessage(ERROR_MESSAGES.NUMBER_RECEIVED_VALUE, { value: valueStr }),
    suggestion: ERROR_MESSAGES.NUMBER_SUGGESTION,
  };
};

/**
 * Creates specific error for invalid date format
 */
export const createDateFormatError = (
  columnName: string,
  value: unknown,
  rowNumber?: number
): DetailedExcelError => {
  const valueStr = String(value);
  return {
    type: ExcelErrorType.INVALID_DATE_FORMAT,
    message: formatErrorMessage(ERROR_MESSAGES.DATE_INVALID_FORMAT, { columnName }),
    columnName,
    value: valueStr,
    rowNumber,
    details: formatErrorMessage(ERROR_MESSAGES.DATE_RECEIVED_VALUE, { value: valueStr }),
    suggestion: ERROR_MESSAGES.DATE_SUGGESTION,
  };
};

/**
 * Creates specific error for missing columns
 */
export const createMissingColumnsError = (
  missingColumns: string[],
  availableColumns: string[]
): DetailedExcelError => {
  return {
    type: ExcelErrorType.MISSING_COLUMNS,
    message: ERROR_MESSAGES.DATA_MISSING_COLUMNS,
    details: formatErrorMessage(ERROR_MESSAGES.DATA_MISSING_COLUMNS_DETAILS, { columns: missingColumns.join(", ") }),
    suggestion: formatErrorMessage(ERROR_MESSAGES.DATA_MISSING_COLUMNS_SUGGESTION, {
      missing: missingColumns.join(", "),
      available: availableColumns.join(", "),
    }),
  };
};

/**
 * Creates specific error for empty data
 */
export const createEmptyDataError = (hasHeaders: boolean): DetailedExcelError => {
  return {
    type: hasHeaders ? ExcelErrorType.EMPTY_DATA : ExcelErrorType.NO_DATA,
    message: hasHeaders ? ERROR_MESSAGES.DATA_ONLY_HEADERS : ERROR_MESSAGES.DATA_NO_CONTENT,
    details: hasHeaders ? ERROR_MESSAGES.DATA_HEADERS_DETAILS : "Plik nie ma zawartości",
    suggestion: ERROR_MESSAGES.DATA_ADD_ROWS_SUGGESTION,
  };
};

/**
 * Creates specific error for file type
 */
export const createFileTypeError = (fileName: string): DetailedExcelError => {
  const ext = fileName.split(".").pop() || "nieznane";
  return {
    type: ExcelErrorType.INVALID_FILE_TYPE,
    message: ERROR_MESSAGES.FILE_INVALID_TYPE,
    details: formatErrorMessage(ERROR_MESSAGES.FILE_INVALID_TYPE_HINT, { file: ext }),
    suggestion: ERROR_MESSAGES.FILE_INVALID_TYPE_SUGGESTION,
  };
};

/**
 * Creates specific error for file size
 */
export const createFileSizeError = (fileSizeMB: number): DetailedExcelError => {
  return {
    type: ExcelErrorType.FILE_TOO_LARGE,
    message: ERROR_MESSAGES.FILE_TOO_LARGE,
    details: formatErrorMessage(ERROR_MESSAGES.FILE_TOO_LARGE_DETAILS, { sizeMB: fileSizeMB }),
    suggestion: ERROR_MESSAGES.FILE_TOO_LARGE_SUGGESTION,
  };
};

/**
 * Creates specific error for file corruption
 */
export const createFileCorruptionError = (originalError: Error): DetailedExcelError => {
  return {
    type: ExcelErrorType.FILE_CORRUPTED,
    message: ERROR_MESSAGES.FILE_CORRUPTED,
    details: originalError.message,
    suggestion: ERROR_MESSAGES.FILE_CORRUPTED_SUGGESTION,
  };
};

/**
 * Creates specific error for processing failure
 */
export const createProcessingError = (error: unknown): DetailedExcelError => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return {
    type: ExcelErrorType.PROCESSING_FAILED,
    message: ERROR_MESSAGES.PROCESSING_ERROR,
    details: errorMessage,
    suggestion: ERROR_MESSAGES.PROCESSING_ERROR_SUGGESTION,
  };
};

/**
 * Formats error for user display
 */
export const formatErrorForDisplay = (error: DetailedExcelError): string => {
  return getDetailedErrorMessage(error);
};

/**
 * Logs error with full context for debugging
 */
export const logErrorWithContext = (
  error: DetailedExcelError,
  context?: Record<string, unknown>
): void => {
  console.error("❌ Excel Error:", {
    type: error.type,
    message: error.message,
    details: error.details,
    rowNumber: error.rowNumber,
    columnName: error.columnName,
    value: error.value,
    suggestion: error.suggestion,
    context,
    timestamp: new Date().toISOString(),
  });
};
