"use client";
import React from "react";
import { Box, Button, CircularProgress, Container, Typography, Alert, Stack } from "@mui/material";
import { useRaportDocumentGenerator } from "./hooks/useRaportDocumentGenerator";
import { useIzrzForm } from "./hooks/useIzrzForm";
import { useUser } from "@/hooks/useUser";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { TASK_TYPES } from "@/constants/tasks";
import { programs } from "@/constants/programs";
import { OPISY_ZADAN } from "@/constants/opisy-zadan";
import type { School } from "@/types";
import type { IzrzFormData } from "./schemas/izrzSchemas";
import { FormSection } from "./components/FormSection";
import { TemplateSelector } from "./components/TemplateSelector";
import { FormField } from "./components/FormField";

export default function IzrzForm() {
  const { isSubmitting, submitMessage, handleSubmit: handleRaportSubmit } = useRaportDocumentGenerator();
  const userContext = useUser();

  const { data: schools, loading: schoolsLoading, error: schoolsError } = useFirebaseData<School>("schools", userContext.user?.uid);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    isFormValid,
  } = useIzrzForm({
    onSubmit: handleRaportSubmit,
  });

  // Watch templateFile for color change
  const templateFile = watch("templateFile");

  // Handle template selection
  const handleTemplateSelect = (file: File) => {
    setValue("templateFile", file);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}>
          📋 Generator IZRZ
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
          Generuj raporty i dokumenty edukacyjne
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {submitMessage && (
        <Alert severity={submitMessage.type === "success" ? "success" : "error"} sx={{ mb: 2 }}>
          {submitMessage.text}
        </Alert>
      )}

      {/* Loading State */}
      {schoolsLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Error State */}
      {schoolsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Błąd podczas ładowania danych: {schoolsError}
        </Alert>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Template Selection */}
          <TemplateSelector onTemplateSelect={handleTemplateSelect} selectedTemplate={templateFile} />

          {/* Basic Information */}
          <FormSection title="Podstawowe informacje" required>
            <FormField
              type="text"
              name="caseNumber"
              control={control}
              error={errors.caseNumber}
              label="Numer sprawy"
              placeholder="Wprowadź numer sprawy"
              required
            />
            <FormField
              type="text"
              name="reportNumber"
              control={control}
              error={errors.reportNumber}
              label="Numer raportu"
              placeholder="Wprowadź numer raportu"
              required
            />
          </FormSection>

          {/* Program and Task Information */}
          <FormSection title="Informacje o programie i zadaniu" required>
            <FormField
              type="select"
              name="programName"
              control={control}
              error={errors.programName}
              label="Nazwa programu"
              options={programs.map((program) => ({ value: program.name, label: program.name }))}
              required
            />
            <FormField
              type="select"
              name="taskType"
              control={control}
              error={errors.taskType}
              label="Typ zadania"
              options={Object.values(TASK_TYPES).map((taskType) => ({ value: taskType.label, label: taskType.label }))}
              required
            />
          </FormSection>

          {/* Location and Date */}
          <FormSection title="Lokalizacja i data" required>
            <FormField
              type="text"
              name="address"
              control={control}
              error={errors.address}
              label="Adres"
              placeholder="Wprowadź adres"
              required
            />
            <FormField type="date" name="dateInput" control={control} error={errors.dateInput} label="Data" required />
          </FormSection>

          {/* Audience Information */}
          <FormSection title="Informacje o widowni" required>
            <FormField
              type="number"
              name="viewerCount"
              control={control}
              error={errors.viewerCount}
              label="Liczba widzów"
              placeholder="Wprowadź liczbę widzów"
              required
            />
            <FormField
              type="textarea"
              name="viewerCountDescription"
              control={control}
              error={errors.viewerCountDescription}
              label="Opis liczby widzów"
              placeholder="Opisz szczegółowo liczbę widzów"
              multiline
              minRows={4}
              required
            />
          </FormSection>

          {/* Task Description */}
          <FormSection title="Opis zadania" required>
            <FormField
              type="textarea"
              name="taskDescription"
              control={control}
              error={errors.taskDescription}
              label="Opis zadania"
              placeholder="Wprowadź szczegółowy opis zadania"
              multiline
              minRows={5}
              required
            />
          </FormSection>

          {/* Additional Information */}
          <FormSection title="Dodatkowe informacje">
            <FormField
              type="textarea"
              name="additionalInfo"
              control={control}
              error={errors.additionalInfo}
              label="Dodatkowe informacje"
              placeholder="Wprowadź dodatkowe informacje (opcjonalne)"
              multiline
              minRows={3}
            />
          </FormSection>

          {/* Options */}
          <FormSection title="Opcje">
            <FormField type="checkbox" name="attendanceList" control={control} label="Lista obecności" />
            <FormField type="checkbox" name="rozdzielnik" control={control} label="Rozdzielnik" />
          </FormSection>

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled={isSubmitting || !isFormValid}
              startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                },
              }}
            >
              {isSubmitting ? "Generowanie..." : "Generuj raport"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
