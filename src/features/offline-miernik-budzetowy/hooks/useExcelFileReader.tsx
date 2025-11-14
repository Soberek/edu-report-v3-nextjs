import { useCallback, useState } from "react";
import { z } from "zod";
import { ExcelRow, ExcelRowSchema, VALID_FILE_EXTENSIONS } from "../types";
import { parseExcelFile } from "../utils/excelParser";

interface UseExcelFileReaderState {
  fileName: string;
  rawData: ExcelRow[];
  isLoading: boolean;
  error: string | null;
}

interface UseExcelFileReaderOptions {
  /**
   * Zod schema for validating rows.
   * Defaults to ExcelRowSchema.
   */
  schema?: z.ZodSchema;
}

/**
 * Custom hook for reading and parsing Excel files.
 * Handles file validation, parsing, and normalization.
 * Validates rows against provided Zod schema.
 *
 * @param options - Configuration options
 * @returns State and handlers for Excel file operations
 *
 * @example
 * const { handleFileUpload, rawData, isLoading, error } = useExcelFileReader();
 */
export function useExcelFileReader(options?: UseExcelFileReaderOptions) {
  const { schema = ExcelRowSchema } = options ?? {};

  const [state, setState] = useState<UseExcelFileReaderState>({
    fileName: "",
    rawData: [],
    isLoading: false,
    error: null,
  });

  const resetState = useCallback(() => {
    setState({
      fileName: "",
      rawData: [],
      isLoading: false,
      error: null,
    });
  }, []);

  const isValidFileExtension = (file: File): boolean => {
    return VALID_FILE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
  };

  const processExcelFile = useCallback(
    (file: File) => {
      const reader = new FileReader();

      reader.onloadstart = () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
      };

      reader.onload = async (evt: ProgressEvent<FileReader>) => {
        try {
          const arrayBuffer = evt.target?.result;

          if (!arrayBuffer) {
            throw new Error("Failed to read file data");
          }

          const validatedData = await parseExcelFile(arrayBuffer as ArrayBuffer, schema);

          setState({
            fileName: file.name,
            rawData: validatedData,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to process Excel file",
          }));
        }
      };

      reader.onerror = () => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Error reading file",
        }));
      };

      reader.readAsArrayBuffer(file);
    },
    [schema]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (!files || files.length === 0) {
        setState((prev) => ({
          ...prev,
          error: "No file selected",
        }));
        return;
      }

      const file = files[0];

      if (!isValidFileExtension(file)) {
        setState((prev) => ({
          ...prev,
          error: "Please select a valid Excel file (.xlsx or .xls)",
        }));
        return;
      }

      processExcelFile(file);
    },
    [processExcelFile]
  );

  return {
    ...state,
    handleFileUpload,
    resetState,
  };
}

export default useExcelFileReader;
