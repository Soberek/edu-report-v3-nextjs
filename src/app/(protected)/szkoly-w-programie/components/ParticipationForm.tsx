import React, { useMemo } from "react";
import { Box, Typography, Paper, Fade } from "@mui/material";
import { School, Group, Person, CalendarToday, Save, Add } from "@mui/icons-material";
import { UseFormReturn } from "react-hook-form";
import type { Contact, Program, School as SchoolType } from "@/types";
import { SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { AutocompleteField, FormField, ActionButton } from "@/components/shared";
import {
  transformSchoolsToOptions,
  transformContactsToOptions,
  transformProgramsToOptions,
  transformSchoolYearsToOptions
} from "../utils";
import {
  SCHOOL_YEAR_OPTIONS,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  HELPER_TEXT,
  BUTTON_LABELS,
  STYLE_CONSTANTS,
  PAGE_CONSTANTS,
  UI_CONSTANTS
} from "../constants";
import type { ParticipationFormProps } from "../types";

// Custom Paper Form Section Component
const CustomFormSection: React.FC<{
  title: string;
  children: React.ReactNode;
  sx?: object;
}> = ({ title, children, sx = {} }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.EXTRA_LARGE,
      background: STYLE_CONSTANTS.COLORS.BACKGROUND_GRADIENT,
      overflow: "hidden",
      mb: STYLE_CONSTANTS.SPACING.LARGE,
      ...sx,
    }}
  >
    <Box
      sx={{
        background: STYLE_CONSTANTS.COLORS.HEADER_BACKGROUND,
        backdropFilter: "blur(10px)",
        p: STYLE_CONSTANTS.SPACING.MEDIUM,
        borderBottom: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          display: "flex",
          alignItems: "center",
          gap: STYLE_CONSTANTS.SPACING.SMALL,
        }}
      >
        <Add sx={{ color: STYLE_CONSTANTS.COLORS.PRIMARY }} />
        {title}
      </Typography>
    </Box>
    <Box sx={{ p: STYLE_CONSTANTS.SPACING.LARGE }}>
      <Fade in timeout={300}>
        <div>{children}</div>
      </Fade>
    </Box>
  </Paper>
);

export const ParticipationForm: React.FC<ParticipationFormProps> = ({
  schools,
  contacts,
  programs,
  loading,
  onSubmit,
  formMethods
}) => {
  const {
    control,
    handleSubmit,
    reset,
    isDirty,
  } = formMethods;

  // Transform data to options using utility functions
  const schoolsOptions = useMemo(() => transformSchoolsToOptions(schools), [schools]);
  const contactsOptions = useMemo(() => transformContactsToOptions(contacts), [contacts]);
  const programsOptions = useMemo(() => transformProgramsToOptions(programs), [programs]);
  const schoolYearsOptions = useMemo(() => transformSchoolYearsToOptions(SCHOOL_YEAR_OPTIONS), []);

  const handleFormSubmit = async (data: SchoolProgramParticipationDTO) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    }
  };

  const renderFormFields = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: STYLE_CONSTANTS.SPACING.MEDIUM }}>
      <Box sx={{
        display: "grid",
        gridTemplateColumns: UI_CONSTANTS.FORM_GRID_COLUMNS.TABLET,
        gap: STYLE_CONSTANTS.SPACING.MEDIUM
      }}>
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
          getOptionLabel={(option) => `${option.code || "Brak kodu"} - ${option.name}`}
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

      {/* Notes */}
      <Box sx={{ gridColumn: "1 / -1" }}>
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

  const renderSubmitButton = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        mt: STYLE_CONSTANTS.SPACING.MEDIUM,
        pt: STYLE_CONSTANTS.SPACING.MEDIUM,
        borderTop: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <ActionButton
        type="submit"
        disabled={loading || !isDirty}
        variant="contained"
        startIcon={<Save />}
        loading={loading}
        sx={{
          borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.LARGE,
          textTransform: "none",
          fontWeight: "bold",
          px: STYLE_CONSTANTS.SPACING.LARGE,
          py: STYLE_CONSTANTS.SPACING.SMALL,
          background: STYLE_CONSTANTS.GRADIENTS.PRIMARY,
          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          "&:hover": {
            background: STYLE_CONSTANTS.GRADIENTS.PRIMARY_HOVER,
            boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            background: "rgba(0,0,0,0.12)",
            color: "rgba(0,0,0,0.26)",
          },
        }}
      >
        {BUTTON_LABELS.SAVE_PARTICIPATION}
      </ActionButton>
    </Box>
  );

  return (
    <CustomFormSection title={PAGE_CONSTANTS.FORM_TITLE}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: STYLE_CONSTANTS.SPACING.MEDIUM,
        }}
      >
        {renderFormFields()}
        {renderSubmitButton()}
      </Box>
    </CustomFormSection>
  );
};
