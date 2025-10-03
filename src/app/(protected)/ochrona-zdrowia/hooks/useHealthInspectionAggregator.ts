import { useState, useCallback } from "react";
import { type FileUploadState, type AggregatedHealthData, MAX_FILES, ERROR_MESSAGES } from "../types";
import { validateExcelFile, readExcelFile, validateExcelData, aggregateHealthData, exportToExcel } from "../utils/fileProcessing";

export const useHealthInspectionAggregator = () => {
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aggregatedData, setAggregatedData] = useState<AggregatedHealthData | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  /**
   * Handles file upload
   */
  const handleFilesUpload = useCallback(
    async (uploadedFiles: FileList | null) => {
      if (!uploadedFiles || uploadedFiles.length === 0) return;

      setGlobalError(null);

      // Check max files limit
      if (files.length + uploadedFiles.length > MAX_FILES) {
        setGlobalError(ERROR_MESSAGES.TOO_MANY_FILES);
        return;
      }

      const newFiles: FileUploadState[] = Array.from(uploadedFiles).map((file) => ({
        file,
        fileName: file.name,
        data: [],
        status: "pending" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Process files
      for (let i = 0; i < newFiles.length; i++) {
        const fileState = newFiles[i];
        const fileIndex = files.length + i;

        // Update status to processing
        setFiles((prev) => prev.map((f, idx) => (idx === fileIndex ? { ...f, status: "processing" as const } : f)));

        try {
          // Validate file
          const validation = validateExcelFile(fileState.file);
          if (!validation.isValid) {
            throw new Error(validation.error);
          }

          // Read file
          const { data } = await readExcelFile(fileState.file);

          // Validate data
          const dataValidation = validateExcelData(data);
          if (!dataValidation.isValid) {
            throw new Error(dataValidation.error);
          }

          // Update with success
          setFiles((prev) => prev.map((f, idx) => (idx === fileIndex ? { ...f, data, status: "success" as const } : f)));
        } catch (error) {
          // Update with error
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === fileIndex
                ? {
                    ...f,
                    status: "error" as const,
                    error: error instanceof Error ? error.message : ERROR_MESSAGES.PROCESSING_ERROR,
                  }
                : f
            )
          );
        }
      }
    },
    [files.length]
  );

  /**
   * Removes a file from the list
   */
  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setAggregatedData(null);
  }, []);

  /**
   * Clears all files
   */
  const clearAll = useCallback(() => {
    setFiles([]);
    setAggregatedData(null);
    setGlobalError(null);
  }, []);

  /**
   * Aggregates data from all successfully processed files
   */
  const aggregateData = useCallback(() => {
    setIsProcessing(true);
    setGlobalError(null);

    try {
      const successfulFiles = files.filter((f) => f.status === "success");

      if (successfulFiles.length === 0) {
        setGlobalError("Brak poprawnie przetworzonych plików");
        return;
      }

      const filesData = successfulFiles.map((f) => ({
        fileName: f.fileName,
        data: f.data,
      }));

      const result = aggregateHealthData(filesData);
      setAggregatedData(result);
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "Błąd podczas agregacji danych");
    } finally {
      setIsProcessing(false);
    }
  }, [files]);

  /**
   * Exports aggregated data to Excel
   */
  const exportData = useCallback(
    async (month?: string) => {
      if (!aggregatedData) {
        setGlobalError("Brak danych do eksportu");
        return false;
      }

      setIsProcessing(true);
      try {
        const success = await exportToExcel(aggregatedData, month);
        if (!success) {
          setGlobalError("Błąd podczas eksportu danych");
        }
        return success;
      } catch (error) {
        setGlobalError(error instanceof Error ? error.message : "Błąd podczas eksportu danych");
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [aggregatedData]
  );

  return {
    files,
    isProcessing,
    aggregatedData,
    globalError,
    handleFilesUpload,
    removeFile,
    clearAll,
    aggregateData,
    exportData,
  };
};
