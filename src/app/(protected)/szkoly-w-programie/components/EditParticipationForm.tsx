import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Box } from "@mui/material";
import { School, Group, Person, CalendarToday } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import type { Contact, Program, School as SchoolType } from "@/types";
import { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";
import { schoolYears } from "@/constants";
import { AutocompleteField, FormField, type AutocompleteOption } from "@/components/shared";

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

    // Memoized option arrays to prevent unnecessary re-renders
    const schoolsOptions: AutocompleteOption[] = React.useMemo(() => schools.map((s) => ({ id: s.id, name: s.name })), [schools]);

    const contactsOptions: AutocompleteOption[] = React.useMemo(
      () => contacts.map((c) => ({ id: c.id, name: `${c.firstName} ${c.lastName}` })),
      [contacts]
    );

    const programsOptions: AutocompleteOption[] = React.useMemo(
      () => programs.map((p) => ({ id: p.id, name: p.code ? `${p.code} - ${p.name}` : p.name })),
      [programs]
    );

    const schoolYearsOptions: AutocompleteOption[] = React.useMemo(() => schoolYears.map((year) => ({ id: year, name: year })), []);

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
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
          {/* School Selection */}
          <AutocompleteField
            name="schoolId"
            control={control}
            label="Szkoła"
            options={schoolsOptions}
            required
            startAdornment={<School />}
            getOptionLabel={(option) => option.name}
          />

          {/* Program Selection */}
          <AutocompleteField
            name="programId"
            control={control}
            label="Program Uczestnictwa"
            options={programsOptions}
            required
            startAdornment={<Group />}
            getOptionLabel={(option) => option.name}
          />

          {/* Coordinator Selection */}
          <AutocompleteField
            name="coordinatorId"
            control={control}
            label="Koordynator"
            options={contactsOptions}
            required
            startAdornment={<Person />}
            getOptionLabel={(option) => option.name}
          />

          {/* School Year Selection */}
          <AutocompleteField
            name="schoolYear"
            control={control}
            label="Rok szkolny"
            options={schoolYearsOptions}
            required
            startAdornment={<CalendarToday />}
            getOptionLabel={(option) => option.name}
          />

          {/* Student Count */}
          <FormField
            name="studentCount"
            control={control}
            label="Liczba uczniów"
            type="number"
            required
            helperText="Wprowadź liczbę uczniów uczestniczących w programie"
          />

          {/* Previous Coordinator */}
          <AutocompleteField
            name="previousCoordinatorId"
            control={control}
            label="Poprzedni Koordynator (opcjonalne)"
            options={contactsOptions}
            startAdornment={<Person />}
            getOptionLabel={(option) => option.name}
          />
        </Box>

        {/* Notes */}
        <Box sx={{ gridColumn: "1 / -1" }}>
          <FormField
            name="notes"
            control={control}
            label="Notatki"
            type="textarea"
            rows={4}
            helperText="Opcjonalne uwagi dotyczące uczestnictwa"
          />
        </Box>

        {/* Form is controlled via onSubmit prop */}
      </Box>
    );
  }
);

EditParticipationForm.displayName = "EditParticipationForm";
