import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState, useEffect, useMemo } from "react";
import { izrzFormSchema, defaultFormValues, type IzrzFormData } from "../schemas/izrzSchemas";
import { UI_CONSTANTS, MESSAGES } from "../constants";
import type { UseIzrzFormProps, SubmitMessage } from "../types";

export const useIzrzForm = ({ onSubmit, defaultValues }: UseIzrzFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);

  // Memoize form configuration
  const formConfig = useMemo(
    () => ({
      resolver: zodResolver(izrzFormSchema),
      mode: "onChange" as const,
      defaultValues: {
        ...defaultFormValues,
        ...defaultValues,
      },
    }),
    [defaultValues]
  );

  const form = useForm<IzrzFormData>(formConfig);
  const { control, handleSubmit, setValue, watch, formState, reset } = form;

  // Auto-dismiss submit message
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage(null);
      }, UI_CONSTANTS.SUBMIT_MESSAGE_DURATION);

      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  // Handle form submission with proper error handling
  const handleFormSubmit = useCallback(
    async (data: IzrzFormData) => {
      setIsSubmitting(true);
      setSubmitMessage(null);

      try {
        await onSubmit(data);
        setSubmitMessage({
          type: "success",
          text: MESSAGES.SUCCESS.REPORT_GENERATED,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR.GENERATION_FAILED;
        setSubmitMessage({
          type: "error",
          text: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  // Set form value helper with validation
  const setFormValue = useCallback(
    (field: keyof IzrzFormData, value: IzrzFormData[keyof IzrzFormData]) => {
      setValue(field, value, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  // Reset form helper
  const resetForm = useCallback(() => {
    reset();
    setSubmitMessage(null);
  }, [reset]);

  // Validation helpers
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
    // Form controls
    control,
    handleSubmit: handleSubmit(handleFormSubmit),
    setValue: setFormValue,
    watch,
    reset: resetForm,

    // Form state
    formState,
    isSubmitting,
    submitMessage,

    // Validation state
    ...validationState,
  };
};
