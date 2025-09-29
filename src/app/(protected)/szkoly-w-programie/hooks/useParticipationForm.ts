import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { schoolProgramParticipationDTOSchema, type SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { getCurrentSchoolYear, SCHOOL_YEAR_OPTIONS } from "../utils";
import type { UseParticipationFormProps, SchoolYear } from "../types";

export const useParticipationForm = ({ onSubmit, initialData }: UseParticipationFormProps) => {
  // Memoize form configuration
  const formConfig = useMemo(
    () => ({
      resolver: zodResolver(schoolProgramParticipationDTOSchema),
      mode: "onChange" as const,
      defaultValues: {
        schoolId: "",
        programId: "",
        coordinatorId: "",
        schoolYear: (initialData?.schoolYear || getCurrentSchoolYear()) as SchoolYear,
        studentCount: 0,
        previousCoordinatorId: "",
        notes: "",
        ...initialData,
      },
    }),
    [initialData]
  );

  const form = useForm<SchoolProgramParticipationDTO>(formConfig);
  const { control, handleSubmit, reset, formState, watch } = form;

  // Handle form submission with error handling
  const handleFormSubmit = useCallback(
    handleSubmit(async (data: SchoolProgramParticipationDTO) => {
      try {
        await onSubmit(data);
        reset();
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      }
    }),
    [handleSubmit, onSubmit, reset]
  );

  // Validation state
  const validationState = useMemo(
    () => ({
      isValid: formState.isValid,
      hasErrors: Object.keys(formState.errors).length > 0,
      errorCount: Object.keys(formState.errors).length,
      isDirty: formState.isDirty,
    }),
    [formState.isValid, formState.errors, formState.isDirty]
  );

  return {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    watch,
    formState,
    ...validationState,
  };
};
