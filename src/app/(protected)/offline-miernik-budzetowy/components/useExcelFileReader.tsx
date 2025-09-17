import { useReducer, useCallback } from "react";
import * as XLSX from "xlsx";

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
  console.log("Reducer action:", action);
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
    const validExtensions = [".xlsx", ".xls"];
    return validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
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

        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        }) as ExcelRow[];

        dispatch({
          type: "LOADING_SUCCESS",
          payload: { fileName: file.name, rawData: data },
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
