import { useReducer, useCallback } from "react";
import ExcelJS from "exceljs";
import { VALID_FILE_EXTENSIONS } from "../types";

export interface ExcelRow {
  [key: string]: string | number;
}

interface UseFileReaderState {
  fileName: string;
  rawData: ExcelRow[];
  isLoading: boolean;
  error: string | null;
}

type FileReaderAction =
  | { type: "RESET" }
  | { type: "LOADING_START" }
  | {
      type: "LOADING_SUCCESS";
      payload: { fileName: string; rawData: ExcelRow[] };
    }
  | { type: "LOADING_ERROR"; payload: string };

const initialState: UseFileReaderState = {
  fileName: "",
  rawData: [],
  isLoading: false,
  error: null,
};

const fileReaderReducer = (
  state: UseFileReaderState,
  action: FileReaderAction,
): UseFileReaderState => {
  switch (action.type) {
    case "RESET":
      return initialState;
    case "LOADING_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOADING_SUCCESS":
      return {
        ...state,
        fileName: action.payload.fileName,
        rawData: action.payload.rawData,
        isLoading: false,
        error: null,
      };
    case "LOADING_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

const useExcelFileReader = () => {
  const [state, dispatch] = useReducer(fileReaderReducer, initialState);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const validateFile = (file: File): boolean => {
    return VALID_FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
  };

  const normalizeCellValue = (cell: ExcelJS.Cell): string | number => {
    const value = cell.value;

    if (value == null) {
      return "";
    }

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      return value;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === "boolean") {
      return value ? "TRUE" : "FALSE";
    }

    return cell.text ?? String(value);
  };

  const processExcelFile = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onloadstart = () => {
      dispatch({ type: "LOADING_START" });
    };

    reader.onload = (evt: ProgressEvent<FileReader>) => {
      try {
        const arrayBuffer = evt.target?.result;
        if (!arrayBuffer) {
          throw new Error("Failed to read file data");
        }

        (async () => {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(arrayBuffer as ArrayBuffer);

          const worksheet = workbook.worksheets[0];
          if (!worksheet) {
            throw new Error("Brak arkusza w pliku");
          }

          const headerRow = worksheet.getRow(1);
          const headers: string[] = [];
          headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const headerValue = cell.value;
            headers[colNumber - 1] = headerValue == null ? "" : String(headerValue);
          });

          const data: ExcelRow[] = [];

          worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            const rowData: ExcelRow = {};
            let hasValue = false;

            headers.forEach((header, index) => {
              if (!header) return;
              const cell = row.getCell(index + 1);
              const normalizedValue = normalizeCellValue(cell);

              if (normalizedValue !== "") {
                hasValue = true;
              }

              rowData[header] = normalizedValue;
            });

            if (hasValue) {
              data.push(rowData);
            }
          });

          dispatch({
            type: "LOADING_SUCCESS",
            payload: { fileName: file.name, rawData: data },
          });
        })().catch((error: unknown) => {
          dispatch({
            type: "LOADING_ERROR",
            payload: error instanceof Error ? error.message : "Failed to process Excel file",
          });
        });
      } catch (error) {
        dispatch({
          type: "LOADING_ERROR",
          payload:
            error instanceof Error
              ? error.message
              : "Failed to process Excel file",
        });
      }
    };

    reader.onerror = () => {
      dispatch({ type: "LOADING_ERROR", payload: "Error reading file" });
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        dispatch({ type: "LOADING_ERROR", payload: "No file selected" });
        return;
      }

      const file = files[0];
      if (!validateFile(file)) {
        dispatch({
          type: "LOADING_ERROR",
          payload: "Please select a valid Excel file (.xlsx or .xls)",
        });
        return;
      }

      processExcelFile(file);
    },
    [processExcelFile],
  );

  return {
    ...state,
    handleFileUpload,
    resetState,
  };
};

export default useExcelFileReader;
