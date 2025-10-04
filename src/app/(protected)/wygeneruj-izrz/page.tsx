"use client";
import React, { useCallback, useMemo } from "react";
import { Box, Button, CircularProgress, Container, Typography, Alert, Stack } from "@mui/material";
import { useIzrzForm } from "./hooks/useIzrzForm";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";
import type { School } from "@/types";
import { TemplateSelector } from "./components/TemplateSelector";
import { FormField } from "./components/FormField";
import { ViewerDescriptionTemplateSelector } from "./components/ViewerDescriptionTemplateSelector";
import { PAGE_CONSTANTS, FIELD_LABELS, FIELD_PLACEHOLDERS, BUTTON_CONSTANTS, STYLE_CONSTANTS } from "./constants";

export default function IzrzForm() {
  const userContext = useUser();
  const { handleSubmit: handleFormSubmission } = useFormSubmission();

  const { data: schools, loading: schoolsLoading, error: schoolsError } = useFirebaseData<School>("schools", userContext.user?.uid);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    isValid,
    isSubmitting,
    submitMessage,
  } = useIzrzForm({
    onSubmit: handleFormSubmission,
  });

  // Watch templateFile for template selection
  const templateFile = watch("templateFile");

  // Handle template selection
  const handleTemplateSelect = useCallback(
    (file: File) => {
      setValue("templateFile", file);
    },
    [setValue]
  );

  // Memoize select options to prevent unnecessary re-renders
  const selectOptions = useMemo(
    () => ({
      programs: programs.map((program) => ({ value: program.name, label: program.name })),
      taskTypes: Object.values(TASK_TYPES).map((taskType) => ({ value: taskType.label, label: taskType.label })),
      schools: schools || [],
    }),
    [schools]
  );

  // Render loading state
  const renderLoadingState = () => (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
      <CircularProgress size={24} />
    </Box>
  );

  // Render error state
  const renderErrorState = (error: string) => (
    <Alert severity="error" sx={{ mb: 2 }}>
      Błąd podczas ładowania danych: {error}
    </Alert>
  );

  // Render success/error messages
  const renderSubmitMessage = () => {
    if (!submitMessage?.text) return null;

    return (
      <Alert severity={submitMessage.type === "success" ? "success" : "error"} sx={{ mb: 2 }}>
        {submitMessage.text}
      </Alert>
    );
  };

  // Render form fields
  const renderFormFields = () => (
    <Stack spacing={PAGE_CONSTANTS.SPACING.FIELD}>
      {/* Template Selection */}
      <TemplateSelector
        onTemplateSelect={handleTemplateSelect}
        selectedTemplate={
          templateFile ? { file: templateFile, name: templateFile.name, size: templateFile.size, type: templateFile.type } : null
        }
      />

      {/* Basic Information */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <FormField
          type="text"
          name="caseNumber"
          control={control}
          error={errors.caseNumber}
          label={FIELD_LABELS.CASE_NUMBER}
          placeholder={FIELD_PLACEHOLDERS.CASE_NUMBER}
          required
        />
        <FormField
          type="text"
          name="reportNumber"
          control={control}
          error={errors.reportNumber}
          label={FIELD_LABELS.REPORT_NUMBER}
          placeholder={FIELD_PLACEHOLDERS.REPORT_NUMBER}
          required
        />
      </Box>

      {/* Program and Task Information */}
      <FormField
        type="select"
        name="programName"
        control={control}
        error={errors.programName}
        label={FIELD_LABELS.PROGRAM_NAME}
        options={selectOptions.programs}
        required
      />
      <FormField
        type="select"
        name="taskType"
        control={control}
        error={errors.taskType}
        label={FIELD_LABELS.TASK_TYPE}
        options={selectOptions.taskTypes}
        required
      />

      {/* Location and Date */}
      <FormField
        type="select"
        name="address"
        control={control}
        error={errors.address}
        label={FIELD_LABELS.ADDRESS}
        options={selectOptions.schools.map((school) => ({
          value: `${school.name}, ${school.address}, ${school.postalCode} ${school.city}`,
          label: `${school.name}, ${school.address}, ${school.postalCode} ${school.city}`,
        }))}
        required
      />
      <FormField type="date" name="dateInput" control={control} error={errors.dateInput} label={FIELD_LABELS.DATE_INPUT} required />

      {/* Audience Information */}
      <FormField
        type="number"
        name="viewerCount"
        control={control}
        error={errors.viewerCount}
        label={FIELD_LABELS.VIEWER_COUNT}
        placeholder={FIELD_PLACEHOLDERS.VIEWER_COUNT}
        required
      />

      <ViewerDescriptionTemplateSelector onSelect={(desc) => setValue("viewerCountDescription", desc)} />

      <FormField
        type="textarea"
        name="viewerCountDescription"
        control={control}
        error={errors.viewerCountDescription}
        label={FIELD_LABELS.VIEWER_COUNT_DESCRIPTION}
        placeholder={FIELD_PLACEHOLDERS.VIEWER_COUNT_DESCRIPTION}
        multiline
        minRows={4}
        required
      />

      {/* Task Description */}
      <FormField
        type="textarea"
        name="taskDescription"
        control={control}
        error={errors.taskDescription}
        label={FIELD_LABELS.TASK_DESCRIPTION}
        placeholder={FIELD_PLACEHOLDERS.TASK_DESCRIPTION}
        multiline
        minRows={5}
        required
      />

      {/* Additional Information */}
      <FormField
        type="textarea"
        name="additionalInfo"
        control={control}
        error={errors.additionalInfo}
        label={FIELD_LABELS.ADDITIONAL_INFO}
        placeholder={FIELD_PLACEHOLDERS.ADDITIONAL_INFO}
        multiline
        minRows={3}
      />

      {/* Options */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormField type="checkbox" name="attendanceList" control={control} label={FIELD_LABELS.ATTENDANCE_LIST} />
        <FormField type="checkbox" name="rozdzielnik" control={control} label={FIELD_LABELS.ROZDZIELNIK} />
      </Box>
    </Stack>
  );

  // Render submit button
  const renderSubmitButton = () => (
    <Box sx={{ display: "flex", justifyContent: "center", mt: PAGE_CONSTANTS.SPACING.BUTTON }}>
      <Button
        type="submit"
        variant="contained"
        size="medium"
        disabled={isSubmitting || !isValid}
        startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: STYLE_CONSTANTS.FONT_SIZES.LARGE,
          fontWeight: "bold",
          borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM,
          background: STYLE_CONSTANTS.GRADIENTS.PRIMARY,
          "&:hover": {
            background: STYLE_CONSTANTS.GRADIENTS.PRIMARY_HOVER,
          },
        }}
      >
        {isSubmitting ? BUTTON_CONSTANTS.GENERATING : BUTTON_CONSTANTS.GENERATE_REPORT}
      </Button>
    </Box>
  );

  return (
    <Container maxWidth={PAGE_CONSTANTS.CONTAINER_MAX_WIDTH} sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: STYLE_CONSTANTS.COLORS.PRIMARY,
          }}
        >
          {PAGE_CONSTANTS.TITLE}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
          {PAGE_CONSTANTS.SUBTITLE}
        </Typography>
      </Box>

      {/* Messages */}
      {renderSubmitMessage()}

      {/* Loading State */}
      {schoolsLoading && renderLoadingState()}

      {/* Error State */}
      {schoolsError && renderErrorState(schoolsError)}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit}>
        {renderFormFields()}
        {renderSubmitButton()}
      </Box>
    </Container>
  );
}
