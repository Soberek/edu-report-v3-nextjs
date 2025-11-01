/**
 * useParticipationForm - Manages participation form state and validation.
 * Wraps React Hook Form with Zod validation and submission handling.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { schoolProgramParticipationDTOSchema, type SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { getCurrentSchoolYear } from "../utils/date.utils";
import type { UseParticipationFormProps } from "../types";
import type { SchoolYear } from "../constants";

/**
 * Hook for managing participation form state with validation.
 * Integrates React Hook Form with Zod schema validation.
 *
 * @param onSubmit - Callback fired when form is submitted (should handle API call)
 * @param initialData - Optional initial form data (for edit forms)
 * @returns Form methods, validation state, and event handlers
 *
 * @example
 * const form = useParticipationForm({
 *   onSubmit: async (data) => {
 *     await api.createParticipation(data);
 *   },
 * });
 *
 * return (
 *   <form onSubmit={form.handleSubmit(form.handleFormSubmit)}>
 *     <input {...form.control.register('studentCount')} />
 *   </form>
 * );
 */
export const useParticipationForm = ({ onSubmit, initialData }: UseParticipationFormProps) => {
  // Memoize form configuration to prevent unnecessary recreations
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

  /**
   * Handles form submission with data normalization.
   * Ensures studentCount is properly converted to number type.
   */
  const handleFormSubmit = useCallback(
    async (data: SchoolProgramParticipationDTO) => {
      try {
        // Ensure studentCount is a number (handle string inputs from form)
        const processedData = {
          ...data,
          studentCount: typeof data.studentCount === "string" ? parseInt(data.studentCount, 10) || 0 : Number(data.studentCount) || 0,
        };
        await onSubmit(processedData);
        reset();
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      }
    },
    [onSubmit, reset]
  );

  // Memoize validation state for performance
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
