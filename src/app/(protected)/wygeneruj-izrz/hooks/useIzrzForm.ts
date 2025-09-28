import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useEffect } from "react";
import { izrzFormSchema, type IzrzFormData } from "../schemas/izrzSchemas";

interface UseIzrzFormProps {
  onSubmit: (data: IzrzFormData) => Promise<void>;
  defaultValues?: Partial<IzrzFormData>;
}

export const useIzrzForm = ({ onSubmit, defaultValues }: UseIzrzFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const form = useForm<IzrzFormData>({
    resolver: zodResolver(izrzFormSchema),
    mode: "onChange",
    defaultValues: {
      caseNumber: "",
      reportNumber: "",
      programName: "",
      taskType: "",
      address: "",
      dateInput: new Date().toISOString().split("T")[0],
      viewerCount: 0,
      viewerCountDescription: `Grupa I: \n Szkoła Podstawowa (klasy 1-3): ... osób \n Opiekunowie: \n Szkola Podstawowa (klasy 4-8): ... osób \n Grupa II: \n Szkoła Ponadpodstawowa (klasy 1-3): ... osób \n Dorosli (studenci, nauczyciele, inni dorośli): ... osób \n`,
      taskDescription: "",
      additionalInfo: "",
      attendanceList: false,
      rozdzielnik: false,
      templateFile: null,
      ...defaultValues,
    },
  });

  const { control, handleSubmit, setValue, watch, formState, reset } = form;

  // Auto-dismiss submit message after 5 seconds
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  // Handle form submission
  const handleFormSubmit = handleSubmit(async (data: IzrzFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await onSubmit(data);
      setSubmitMessage({
        type: "success",
        text: "Raport został wygenerowany! Pobieranie rozpoczęte.",
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Błąd podczas generowania raportu. Spróbuj ponownie.",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  // Set form value helper
  const setFormValue = useCallback(
    (field: keyof IzrzFormData, value: any) => {
      setValue(field, value, { shouldValidate: true });
    },
    [setValue]
  );

  // Reset form helper
  const resetForm = useCallback(() => {
    reset();
    setSubmitMessage(null);
  }, [reset]);

  // Validation helpers
  const isFormValid = formState.isValid;
  const hasErrors = Object.keys(formState.errors).length > 0;

  return {
    control,
    handleSubmit: handleFormSubmit,
    setValue: setFormValue,
    watch,
    formState,
    reset: resetForm,
    isFormValid,
    hasErrors,
    isSubmitting,
    submitMessage,
  };
};
