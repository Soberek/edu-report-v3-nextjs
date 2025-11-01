import React from "react";
import { Box } from "@mui/material";
import { School, Group, Person, CalendarToday } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import type { Control } from "react-hook-form";
import { AutocompleteField, FormField, type AutocompleteOption } from "@/components/shared";
import type { SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { FIELD_LABELS, HELPER_TEXT, UI_CONSTANTS, STYLE_CONSTANTS } from "../constants";

/**
 * Props for the ParticipationFormFields component
 */
export interface ParticipationFormFieldsProps {
  readonly control: Control<SchoolProgramParticipationDTO>;
  readonly schoolsOptions: AutocompleteOption[];
  readonly contactsOptions: AutocompleteOption[];
  readonly programsOptions: AutocompleteOption[];
  readonly schoolYearsOptions: AutocompleteOption[];
}

/**
 * Reusable form fields component for participation data
 * Used by both ParticipationForm (add) and EditParticipationForm (edit)
 * Provides consistent field layout and validation across the feature
 */
export const ParticipationFormFields: React.FC<ParticipationFormFieldsProps> = ({
  control,
  schoolsOptions,
  contactsOptions,
  programsOptions,
  schoolYearsOptions,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: STYLE_CONSTANTS.SPACING.MEDIUM }}>
    {/* Grid for main fields */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: UI_CONSTANTS.FORM_GRID_COLUMNS.TABLET,
        gap: STYLE_CONSTANTS.SPACING.MEDIUM,
      }}
    >
      {/* School Selection */}
      <AutocompleteField
        name="schoolId"
        control={control}
        label={FIELD_LABELS.SCHOOL}
        options={schoolsOptions}
        required
        startAdornment={<School />}
      />

      {/* Program Selection */}
      <AutocompleteField
        name="programId"
        control={control}
        label={FIELD_LABELS.PROGRAM}
        options={programsOptions}
        required
        startAdornment={<Group />}
        getOptionLabel={(option) =>
          option.code ? `${option.code} - ${option.name}` : option.name
        }
      />

      {/* Coordinator Selection */}
      <AutocompleteField
        name="coordinatorId"
        control={control}
        label={FIELD_LABELS.COORDINATOR}
        options={contactsOptions}
        required
        startAdornment={<Person />}
      />

      {/* School Year Selection */}
      <AutocompleteField
        name="schoolYear"
        control={control}
        label={FIELD_LABELS.SCHOOL_YEAR}
        options={schoolYearsOptions}
        required
        startAdornment={<CalendarToday />}
      />

      {/* Student Count */}
      <FormField
        name="studentCount"
        control={control}
        label={FIELD_LABELS.STUDENT_COUNT}
        type="number"
        required
        helperText={HELPER_TEXT.STUDENT_COUNT}
      />

      {/* Previous Coordinator */}
      <AutocompleteField
        name="previousCoordinatorId"
        control={control}
        label={FIELD_LABELS.PREVIOUS_COORDINATOR}
        options={contactsOptions}
        startAdornment={<Person />}
      />
    </Box>

    {/* Notes - Full width */}
    <Box>
      <FormField
        name="notes"
        control={control}
        label={FIELD_LABELS.NOTES}
        type="textarea"
        rows={4}
        helperText={HELPER_TEXT.NOTES}
      />
    </Box>
  </Box>
);
