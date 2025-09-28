import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schoolTypes } from "@/constants";
import {
  createSchoolSchema,
  editSchoolSchema,
  defaultSchoolFormValues,
  type CreateSchoolFormData,
  type EditSchoolFormData,
} from "../schemas/schoolSchemas";
import type { UseSchoolFormProps } from "../types";

export const useSchoolForm = ({ mode, school, onSubmit }: UseSchoolFormProps) => {
  const schema = mode === "create" ? createSchoolSchema : editSchoolSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
    watch,
    setValue,
  } = useForm<CreateSchoolFormData | EditSchoolFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: defaultSchoolFormValues,
  });

  // Reset form with school data when in edit mode
  React.useEffect(() => {
    if (mode === "edit" && school) {
      reset({
        name: school.name || "",
        email: school.email || "",
        address: school.address || "",
        city: school.city || "",
        postalCode: school.postalCode || "",
        municipality: school.municipality || "",
        type: school.type || [],
      });
    }
  }, [mode, school, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    onSubmit(data);
  });

  // Handle type selection (checkbox group)
  const handleTypeChange = (typeKey: string, checked: boolean) => {
    const currentTypes = watch("type") || [];
    if (checked) {
      setValue("type", [...currentTypes, typeKey], { shouldValidate: true });
    } else {
      setValue("type", currentTypes.filter(t => t !== typeKey), { shouldValidate: true });
    }
  };

  const isFormValid = isValid && isDirty;
  const hasErrors = Object.keys(errors).length > 0;
  const selectedTypes = watch("type") || [];

  return {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty, isValid },
    isFormValid,
    hasErrors,
    watch,
    handleTypeChange,
    selectedTypes,
    schoolTypes: Object.entries(schoolTypes),
  };
};
