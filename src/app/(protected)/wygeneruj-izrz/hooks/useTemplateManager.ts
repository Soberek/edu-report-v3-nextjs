import { useCallback, useState } from "react";
import { TEMPLATE_CONSTANTS, API_CONSTANTS, MESSAGES, UI_CONSTANTS } from "../constants";
import type { UseTemplateManagerProps, SelectedTemplate } from "../types";

export const useTemplateManager = ({ onTemplateSelect }: UseTemplateManagerProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to validate file
  const validateFile = useCallback((file: File): boolean => {
    if (file.size > UI_CONSTANTS.MAX_FILE_SIZE) {
      setError(MESSAGES.ERROR.FILE_TOO_LARGE);
      return false;
    }

    if (!TEMPLATE_CONSTANTS.ALLOWED_FILE_TYPES.includes(file.type as string)) {
      setError(MESSAGES.ERROR.INVALID_FILE_TYPE);
      return false;
    }

    return true;
  }, []);

  // Helper function to create SelectedTemplate object
  const createSelectedTemplate = useCallback(
    (file: File): SelectedTemplate => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }),
    []
  );

  // Choose predefined template
  const choosePredefinedTemplate = useCallback(
    async (templateName: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_CONSTANTS.TEMPLATE_BASE_PATH}/${templateName}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const file = new File([blob], templateName, { type: blob.type });

        if (!validateFile(file)) {
          return;
        }

        const selectedTemplate = createSelectedTemplate(file);
        setSelectedTemplate(selectedTemplate);
        onTemplateSelect(file);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.TEMPLATE_LOAD_FAILED;
        setError(errorMessage);
        console.error("Error fetching template:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [onTemplateSelect, validateFile, createSelectedTemplate]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    (file: File): void => {
      setError(null);

      if (!validateFile(file)) {
        return;
      }

      const selectedTemplate = createSelectedTemplate(file);
      setSelectedTemplate(selectedTemplate);
      onTemplateSelect(file);
    },
    [onTemplateSelect, validateFile, createSelectedTemplate]
  );

  // Clear template
  const clearTemplate = useCallback((): void => {
    setSelectedTemplate(null);
    setError(null);
  }, []);

  return {
    selectedTemplate,
    loading,
    error,
    choosePredefinedTemplate,
    handleFileUpload,
    clearTemplate,
  };
};
