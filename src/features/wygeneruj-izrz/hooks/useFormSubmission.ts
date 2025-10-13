import { useCallback } from "react";
import type { IzrzFormData } from "../schemas/izrzSchemas";
import { API_CONSTANTS, MESSAGES } from "../constants";
import type { UseFormSubmissionProps } from "../types";

export const useFormSubmission = ({ onSuccess, onError }: UseFormSubmissionProps = {}) => {
  // Helper function to create FormData from form data
  const createFormData = useCallback((data: IzrzFormData): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "templateFile" && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    return formData;
  }, []);

  // Helper function to extract filename from response headers
  const extractFilename = useCallback((response: Response): string => {
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.includes("filename=")) {
      return disposition.split("filename=")[1].replace(/"/g, "");
    }
    return "report.docx";
  }, []);

  // Helper function to trigger file download
  const triggerDownload = useCallback((blob: Blob, filename: string): void => {
    const downloadLink = document.createElement("a");
    const objectURL = URL.createObjectURL(blob);

    downloadLink.href = objectURL;
    downloadLink.download = filename;
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up the object URL
    URL.revokeObjectURL(objectURL);
  }, []);

  // Main submission handler
  const handleSubmit = useCallback(
    async (data: IzrzFormData): Promise<void> => {
      try {
        const formData = createFormData(data);

        const response = await fetch(API_CONSTANTS.GENERATE_IZRZ_ENDPOINT, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const fileBlob = await response.blob();
        const filename = extractFilename(response);

        triggerDownload(fileBlob, filename);

        onSuccess?.(filename);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.GENERATION_FAILED;
        onError?.(new Error(errorMessage));
        throw error;
        throw error;
      }
    },
    [createFormData, extractFilename, triggerDownload, onSuccess, onError]
  );

  return { handleSubmit };
};
