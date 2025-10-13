import { useIzrzForm, useFormSubmission, useTemplateManager } from ".";
import type { IzrzFormData } from "../schemas/izrzSchemas";

export const useCombinedForm = () => {
  const { control, handleSubmit, isSubmitting, submitMessage, isValid, setValue } = useIzrzForm({
    onSubmit: async (data) => {
      await submitForm(data);
    },
  });

  const { handleSubmit: submitForm } = useFormSubmission({
    onSuccess: (filename) => console.log("Success:", filename),
    onError: (error) => console.error("Error:", error),
  });

  const {
    selectedTemplate,
    loading: templateLoading,
    error: templateError,
    choosePredefinedTemplate,
  } = useTemplateManager({
    onTemplateSelect: (file) => {
      setValue("templateFile", file);
    },
  });

  return {
    control,
    handleSubmit,
    isSubmitting,
    submitMessage,
    isValid,
    selectedTemplate,
    templateLoading,
    templateError,
    choosePredefinedTemplate,
  };
};
