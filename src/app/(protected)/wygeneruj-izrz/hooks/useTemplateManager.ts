import { useCallback, useState } from "react";

interface UseTemplateManagerProps {
  onTemplateSelect: (file: File) => void;
}

export const useTemplateManager = ({ onTemplateSelect }: UseTemplateManagerProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const choosePredefinedTemplate = useCallback(async (templateName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/generate-templates/${templateName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], templateName, { type: blob.type });
      
      setSelectedTemplate(file);
      onTemplateSelect(file);
    } catch (error) {
      console.error("Error fetching template:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [onTemplateSelect]);

  const handleFileUpload = useCallback((file: File) => {
    setSelectedTemplate(file);
    onTemplateSelect(file);
  }, [onTemplateSelect]);

  const clearTemplate = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  return {
    selectedTemplate,
    loading,
    choosePredefinedTemplate,
    handleFileUpload,
    clearTemplate,
  };
};
