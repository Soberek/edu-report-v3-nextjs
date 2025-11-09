import { useState } from "react";
import { useNotification } from "../../../../../hooks/useNotification";
import type { GenerateDocumentFormData } from "../schemas";

interface UseGenerateDocumentReturn {
  isLoading: boolean;
  isError: boolean;
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  generateDocument: (formData: GenerateDocumentFormData) => Promise<void>;
}

/**
 * Hook to manage document generation workflow
 * Handles dialog state and document generation from form data
 */
export const useGenerateDocument = (): UseGenerateDocumentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showSuccess, showError } = useNotification();

  const downloadDocument = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateDocument = async (formData: GenerateDocumentFormData) => {
    setIsLoading(true);
    setIsError(false);

    try {
      // Step 1: Fetch template
      const templateResponse = await fetch("/generate-templates/izrz.docx");
      if (!templateResponse.ok) {
        throw new Error("Failed to load template");
      }
      const templateBlob = await templateResponse.blob();
      const templateFile = new File([templateBlob], "izrz.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Step 2: Prepare form data for API
      const apiFormData = new FormData();
      apiFormData.append("templateFile", templateFile);

      // Map form data to API fields
      Object.entries(formData).forEach(([key, value]) => {
        apiFormData.append(key, String(value));
      });

      // Step 3: Generate document
      const generateResponse = await fetch("/api/generate-izrz", {
        method: "POST",
        body: apiFormData,
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate document");
      }

      const docBlob = await generateResponse.blob();
      const fileName = `IZRZ_${formData.reportNumber}_${formData.dateInput}`;
      downloadDocument(docBlob, fileName);

      showSuccess("Dokument został wygenerowany i pobrany!");
      setIsDialogOpen(false);
    } catch (error) {
      setIsError(true);
      showError(error instanceof Error ? error.message : "Błąd podczas generowania dokumentu");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isError,
    isDialogOpen,
    openDialog: () => setIsDialogOpen(true),
    closeDialog: () => setIsDialogOpen(false),
    generateDocument,
  };
};

/**
 * Re-export useGenerateDocumentForm for barrel consistency
 */
export { useGenerateDocumentForm } from "./useGenerateDocumentForm";
