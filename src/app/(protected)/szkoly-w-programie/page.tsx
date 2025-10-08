"use client";
import React, { useMemo } from "react";
import { Alert, Snackbar, Box } from "@mui/material";
// import { usePrograms } from "@/hooks/useProgram";
import { useForm } from "react-hook-form";
// import type { Contact, Program, School as SchoolType } from "@/types";
import { SchoolProgramParticipationTable } from "./components/table";
import { ParticipationForm } from "./components/ParticipationForm";
// import { useFirebaseData } from "@/hooks/useFirebaseData";
// import { useUser } from "@/hooks/useUser";
import { PageHeader, LoadingSpinner } from "@/components/shared";
import { SchoolProgramParticipationDTO } from "@/models/SchoolProgramParticipation";
// import { useParticipationForm } from "./hooks/useParticipationForm";
import { useParticipationPage } from "./hooks/useParticipationPage";
import { createDefaultFormValues } from "./utils";
import { PAGE_CONSTANTS, STYLE_CONSTANTS, UI_CONSTANTS, MESSAGES } from "./constants";
import type { ParticipationFormProps } from "./types";

export default function SchoolsProgramParticipation() {
  // const userContext = useUser();

  // Use custom hook for page logic
  const {
    schools,
    contacts,
    programs,
    participations,
    mappedParticipations,
    isLoading,
    schoolProgramParticipationLoading,
    error,
    lookupMaps,
    handleSubmit,
    handleUpdateParticipation,
    handleDeleteParticipation,
    snackbar,
    handleCloseSnackbar,
  } = useParticipationPage();

  // Form configuration
  const formMethods = useForm<SchoolProgramParticipationDTO>({
    defaultValues: createDefaultFormValues(),
  });

  const formProps: ParticipationFormProps = {
    schools,
    contacts,
    programs,
    loading: schoolProgramParticipationLoading,
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

  const renderTableSection = () => (
    <SchoolProgramParticipationTable
      participations={participations}
      schoolsMap={memoizedData.schoolsMap}
      contactsMap={memoizedData.contactsMap}
      programsMap={memoizedData.programsMap}
      errorMessage={error}
      loading={schoolProgramParticipationLoading}
      schools={schools}
      contacts={contacts}
      programs={programs}
      onUpdate={handleUpdateParticipation}
      onDelete={handleDeleteParticipation}
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
      {renderFormSection()}
      {renderTableSection()}
      {renderSnackbar()}
    </Box>
  );
}
