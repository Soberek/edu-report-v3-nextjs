import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { izrzFormSchema, type IzrzFormData } from "../schemas/izrzSchemas";

interface UseIzrzFormProps {
  onSubmit: (data: any) => void; // Changed to any to match the existing hook
  defaultValues?: Partial<IzrzFormData>;
}

export const useIzrzForm = ({ onSubmit, defaultValues }: UseIzrzFormProps) => {
  const form = useForm({
    resolver: zodResolver(izrzFormSchema),
    mode: "onChange",
    defaultValues: {
      caseNumber: "",
      reportNumber: "",
      programName: "",
      taskType: "",
      address: "",
      dateInput: "",
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

  // Handle form submission
  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  // Set form value helper
  const setFormValue = useCallback((field: string, value: any) => {
    setValue(field, value, { shouldValidate: true });
  }, [setValue]);

  // Reset form helper
  const resetForm = useCallback(() => {
    reset();
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
  };
};
