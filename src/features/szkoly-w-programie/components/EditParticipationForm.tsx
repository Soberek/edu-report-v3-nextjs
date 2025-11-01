import React, { useEffect, forwardRef, useImperativeHandle, useMemo } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import type { Contact, Program, School as SchoolType } from "@/types";
import { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";
import { schoolYears } from "@/constants";
import { ParticipationFormFields } from "./ParticipationFormFields";
import {
  createSchoolOptions,
  createContactOptions,
  createProgramOptions,
  createSchoolYearOptions,
} from "../utils/optionFactories";

// Form data type that matches the form structure
type FormData = {
  schoolId: string;
  programId: string;
  coordinatorId: string;
  schoolYear: "2024/2025" | "2025/2026" | "2026/2027" | "2027/2028";
  previousCoordinatorId?: string;
  studentCount: number;
  notes?: string;
};

interface EditParticipationFormProps {
  participation: SchoolProgramParticipation | null;
  schools: SchoolType[];
  contacts: Contact[];
  programs: Program[];
  onSubmit: (data: FormData) => void;
}

export interface EditParticipationFormRef {
  submit: () => void;
  isDirty: boolean;
}

export const EditParticipationForm = forwardRef<EditParticipationFormRef, EditParticipationFormProps>(
  ({ participation, schools, contacts, programs, onSubmit }, ref) => {
    const formMethods = useForm<FormData>({
      defaultValues: {
        schoolId: "",
        programId: "",
        coordinatorId: "",
        schoolYear: "2025/2026",
        previousCoordinatorId: "",
        studentCount: 0,
        notes: "",
      },
    });

    const {
      control,
      handleSubmit,
      formState: { isDirty },
    } = formMethods;

    // Expose form methods to parent
    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isDirty,
    }));

    // Memoized option arrays using factory functions
    const schoolsOptions = useMemo(
      () => createSchoolOptions(schools),
      [schools]
    );

    const contactsOptions = useMemo(
      () => createContactOptions(contacts),
      [contacts]
    );

    const programsOptions = useMemo(
      () => createProgramOptions(programs),
      [programs]
    );

    const schoolYearsOptions = useMemo(
      () => createSchoolYearOptions(schoolYears),
      []
    );

    // Update form when participation changes
    useEffect(() => {
      if (participation) {
        formMethods.reset({
          schoolId: participation.schoolId,
          programId: participation.programId,
          coordinatorId: participation.coordinatorId,
          schoolYear: participation.schoolYear,
          previousCoordinatorId: participation.previousCoordinatorId || "",
          studentCount: participation.studentCount,
          notes: participation.notes || "",
        });
      }
    }, [participation, formMethods]);

    const handleFormSubmit = (data: FormData) => {
      onSubmit(data);
    };

    return (
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <ParticipationFormFields
          control={control}
          schoolsOptions={schoolsOptions}
          contactsOptions={contactsOptions}
          programsOptions={programsOptions}
          schoolYearsOptions={schoolYearsOptions}
        />
      </Box>
    );
  }
);

EditParticipationForm.displayName = "EditParticipationForm";
