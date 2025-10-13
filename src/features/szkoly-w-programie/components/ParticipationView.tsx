 
"use client";
import React, { useMemo } from "react";
import { Alert, Snackbar, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { SchoolProgramParticipationTable } from "./table";
import { ParticipationForm } from "./ParticipationForm";
import { ProgramStatistics } from "./ProgramStatistics";
import { SchoolYearSelector } from "./SchoolYearSelector";
import { ProgramSelector } from "./ProgramSelector";
import { PageHeader, LoadingSpinner } from "@/components/shared";
import { SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
import { createDefaultFormValues } from "../utils";
import { PAGE_CONSTANTS, STYLE_CONSTANTS, UI_CONSTANTS, MESSAGES } from "../constants";
import type { ParticipationFormProps } from "../types";
import { useSzkolyWProgramie } from "@/hooks/useSzkolyWProgramie";

type ParticipationViewProps = ReturnType<typeof useSzkolyWProgramie>;

export default function ParticipationView(props: ParticipationViewProps) {
  const {
    schools,
    contacts,
    programs,
    participations,
    selectedSchoolYear,
    setSelectedSchoolYear,
    availableSchoolYears,
    selectedProgram,
    setSelectedProgram,
    availablePrograms,
    isLoading,
    error,
    lookupMaps,
    handleSubmit,
    handleUpdateParticipation,
    handleDeleteParticipation,
    snackbar,
    handleCloseSnackbar,
  } = props;

  // Form configuration
  const formMethods = useForm<SchoolProgramParticipationDTO>({
    defaultValues: createDefaultFormValues(),
  });

  const formProps: ParticipationFormProps = {
    schools,
    contacts,
    programs,
    loading: isLoading,
    onSubmit: handleSubmit,
    formMethods,
  };

  // Memoized data for performance
  const memoizedData = useMemo(
    () => ({
      schoolsMap: lookupMaps.schoolsMap,
      contactsMap: lookupMaps.contactsMap,
      programsMap: lookupMaps.programsMap,
    }),
    [lookupMaps]
  );

  const renderLoadingState = () => (
    <Box sx={{ py: 4, px: 2 }}>
      <LoadingSpinner size={48} message={MESSAGES.LOADING.LOADING_DATA} sx={{ minHeight: 400 }} />
    </Box>
  );

  const renderErrorAlert = () =>
    error && (
      <Alert severity="error" sx={{ mb: STYLE_CONSTANTS.SPACING.MEDIUM }}>
        {MESSAGES.ERROR.LOAD_FAILED}: {error}
      </Alert>
    );

  const renderHeader = () => <PageHeader title={PAGE_CONSTANTS.TITLE} subtitle={PAGE_CONSTANTS.SUBTITLE} />;

  const renderFormSection = () => <ParticipationForm {...formProps} />;

  const renderStatisticsSection = () => <ProgramStatistics participations={participations} programs={programs} />;

  const renderSchoolYearSelector = () => (
    <SchoolYearSelector selectedYear={selectedSchoolYear} onYearChange={setSelectedSchoolYear} availableYears={[...availableSchoolYears]} />
  );

  const renderProgramSelector = () => (
    <ProgramSelector selectedProgram={selectedProgram} onProgramChange={setSelectedProgram} availablePrograms={[...availablePrograms]} />
  );

  const renderTableSection = () => (
    <SchoolProgramParticipationTable
      participations={participations}
      schoolsMap={memoizedData.schoolsMap}
      contactsMap={memoizedData.contactsMap}
      programsMap={memoizedData.programsMap}
      errorMessage={error}
      loading={isLoading}
      schools={schools}
      contacts={contacts}
      programs={programs}
      onUpdate={handleUpdateParticipation}
      onDelete={handleDeleteParticipation}
      onAdd={handleSubmit}
    />
  );

  const renderSnackbar = () => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={UI_CONSTANTS.SNACKBAR_DURATION}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbar.type}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.MEDIUM,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  if (isLoading) {
    return renderLoadingState();
  }

  return (
    <Box sx={{ py: 4, px: 2 }}>
      {renderHeader()}
      {renderErrorAlert()}
      {renderStatisticsSection()}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        {renderSchoolYearSelector()}
        {renderProgramSelector()}
      </Box>
      {renderTableSection()}
      {renderSnackbar()}
    </Box>
  );
}
