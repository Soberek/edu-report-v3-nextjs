"use client";

import { useForm } from "react-hook-form";
import { Container, Alert, Snackbar } from "@mui/material";
import { useReducer, useRef } from "react";

import { ActForm, ActCaseRecordsTable, FilterSection, EditActForm, PageHeader, LoadingSpinner, EditDialog } from "./components";
import { DEFAULT_FORM_VALUES, INITIAL_STATE, UI_CONFIG, MESSAGES } from "./constants";
import { spisySprawReducer } from "./reducers/spisySprawReducer";
import { useSpisySprawData, useSpisySprawActions } from "./hooks";
import type { CaseRecord } from "@/types";

export default function Acts() {
  // Organized state management with useReducer
  const [state, dispatch] = useReducer(spisySprawReducer, INITIAL_STATE);
  const formRef = useRef<{ submit: () => void; isDirty: boolean } | null>(null);

  // Form management with proper typing
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CaseRecord>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // Business logic hooks
  const { actRecords, actsOptions, actsOptionsCodes, sortedCaseRecords, actRecordsLoading, getErrorMessages } = useSpisySprawData(state);

  const {
    handleAddActRecord,
    handleDeleteCaseRecord,
    handleFormSubmit,
    handleEditCaseRecord,
    handleSaveCaseRecord,
    handleCloseEditDialog,
    handleCloseSnackbar,
    handleCodeChange,
  } = useSpisySprawActions({
    state,
    dispatch,
    formRef,
    reset,
  });

  // Show loading state
  if (actRecordsLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingSpinner size={48} message={MESSAGES.LOADING_MESSAGE} sx={{ minHeight: 400 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <PageHeader title="Spisy Spraw" subtitle="Zarządzanie aktami spraw administracyjnych" />

      {/* Error Alerts */}
      {getErrorMessages()?.map((error, index) => (
        <Alert key={index} severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ))}

      {/* Add New Act Section */}
      <ActForm control={control} handleSubmit={handleSubmit} onSubmit={handleAddActRecord} errors={errors} actsOptions={actsOptionsCodes} />

      {/* Filter and Export Section */}
      <FilterSection
        selectedCode={state.selectedCode}
        actsOptions={actsOptions}
        sortedCaseRecords={sortedCaseRecords}
        onCodeChange={handleCodeChange}
      />

      {/* Cases Table */}
      <ActCaseRecordsTable
        caseRecords={actRecords}
        loading={actRecordsLoading}
        deleteCaseRecord={handleDeleteCaseRecord}
        editCaseRecord={handleEditCaseRecord}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={state.snackbar.open}
        autoHideDuration={UI_CONFIG.SNACKBAR_AUTO_HIDE_DURATION}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={state.snackbar.type} sx={{ width: "100%" }}>
          {state.snackbar.message}
        </Alert>
      </Snackbar>

      {/* Edit Dialog */}
      <EditDialog
        open={state.editDialogOpen}
        onClose={handleCloseEditDialog}
        title="Edytuj akt sprawy"
        onSave={handleSaveCaseRecord}
        loading={state.dialogLoading}
        maxWidth={UI_CONFIG.EDIT_DIALOG_MAX_WIDTH}
      >
        <EditActForm ref={formRef} caseRecord={state.editingCaseRecord} actsOptions={actsOptionsCodes} onSubmit={handleFormSubmit} />
      </EditDialog>
    </Container>
  );
}
