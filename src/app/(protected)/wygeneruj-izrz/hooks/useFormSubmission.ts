import { useCallback } from "react";
import type { IzrzFormData } from "../schemas/izrzSchemas";

export const useFormSubmission = () => {
  const handleSubmit = useCallback(async (data: IzrzFormData) => {
    const formDataToSend = new FormData();

    // Append all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "templateFile" && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === "boolean") {
          formDataToSend.append(key, value.toString());
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    const response = await fetch("/api/generate-izrz", {
      method: "POST",
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error("Failed to generate document");
    }

    const fileBlob = await response.blob();

    // Extract filename from response headers
    let filename = "report.docx";
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1];
    }

    // Create download link and trigger download
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(fileBlob);
    downloadLink.download = filename;
    downloadLink.click();

    // Clean up the object URL
    URL.revokeObjectURL(downloadLink.href);
  }, []);

  return { handleSubmit };
};
