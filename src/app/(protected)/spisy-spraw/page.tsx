"use client";

import { useForm } from "react-hook-form";
import { Container, Alert, Box, Button, TextField, InputAdornment } from "@mui/material";
import { useReducer, useRef } from "react";
import { Add, Description, Category, FilterList, Search } from "@mui/icons-material";

import { 
  ActCaseRecordsTable,
  FilterSection,
  EditActForm,
  PageHeader,
  LoadingSpinner,
  EditDialog,
  ConfirmDialog,
  StatsCard,
  DEFAULT_FORM_VALUES, 
  INITIAL_STATE, 
  UI_CONFIG, 
  MESSAGES,
  spisySprawReducer,
  useSpisySpraw
} from "@/features/spisy-spraw";
import type { CaseRecord } from "@/types";
import { NotificationSnackbar } from "@/components/shared";

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

  // Business logic hook
  const {
    actRecords,
    actsOptions,
    actsOptionsCodes,
    sortedCaseRecords,
    errorMessages,
    stats,
    suggestedReferenceNumber,
    isLoading,
    createLoading,
    addActRecord,
    updateActRecord,
    deleteActRecord,
    openCreateDialog,
    closeCreateDialog,
    editCaseRecord,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
    saveCaseRecord,
    closeEditDialog,
    notification,
    closeNotification,
    changeCode,
    searchChange,
  } = useSpisySpraw({
    state,
    dispatch,
    formRef,
    reset,
  });

  // Show loading state
  if (isLoading) {
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
      {errorMessages && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessages}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 3,
        }}
      >
        <StatsCard
          title="Wszystkie akta"
          value={stats.total}
          subtitle="Łączna liczba akt spraw"
          icon={<Description />}
          color="primary"
          loading={isLoading}
        />
        <StatsCard
          title="Filtrowane wyniki"
          value={stats.filtered}
          subtitle={state.selectedCode.title}
          icon={<FilterList />}
          color="info"
          loading={isLoading}
        />
        <StatsCard
          title="Unikalne kody"
          value={Object.keys(stats.byCode).length}
          subtitle="Różne typy akt"
          icon={<Category />}
          color="success"
          loading={isLoading}
        />
        <StatsCard
          title="Najpopularniejszy"
          value={stats.mostUsedCode?.code || "-"}
          subtitle={stats.mostUsedCode ? `${stats.mostUsedCode.count} rekordów` : "Brak danych"}
          icon={<Description />}
          color="warning"
          loading={isLoading}
        />
      </Box>

      {/* Add New Act Button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreateDialog}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Dodaj nowy akt sprawy
        </Button>
      </Box>

      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Szukaj po kodzie, numerze, tytule, nadawcy, uwagach lub notatkach..."
          value={state.searchQuery}
          onChange={(e) => searchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Filter and Export Section */}
      <FilterSection
        selectedCode={state.selectedCode}
        actsOptions={actsOptions}
        sortedCaseRecords={sortedCaseRecords}
        onCodeChange={changeCode}
      />

      {/* Cases Table */}
      <ActCaseRecordsTable
        caseRecords={sortedCaseRecords}
        loading={isLoading}
        deleteCaseRecord={openDeleteDialog}
        editCaseRecord={editCaseRecord}
      />

      {/* Snackbar for notifications */}
      <NotificationSnackbar
        notification={notification}
        onClose={closeNotification}
        autoHideDuration={UI_CONFIG.SNACKBAR_AUTO_HIDE_DURATION}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      />

      {/* Create Dialog */}
      <EditDialog
        open={state.createDialogOpen}
        onClose={closeCreateDialog}
        title="Dodaj nowy akt sprawy"
        onSave={saveCaseRecord}
        loading={state.createLoading}
        maxWidth={UI_CONFIG.EDIT_DIALOG_MAX_WIDTH}
      >
        <EditActForm
          ref={formRef}
          caseRecord={null}
          actsOptions={actsOptionsCodes}
          suggestedReferenceNumber={suggestedReferenceNumber}
          onSubmit={addActRecord}
        />
      </EditDialog>

      {/* Edit Dialog */}
      <EditDialog
        open={state.editDialogOpen}
        onClose={closeEditDialog}
        title="Edytuj akt sprawy"
        onSave={saveCaseRecord}
        loading={state.dialogLoading}
        maxWidth={UI_CONFIG.EDIT_DIALOG_MAX_WIDTH}
      >
        <EditActForm ref={formRef} caseRecord={state.editingCaseRecord} actsOptions={actsOptionsCodes} onSubmit={updateActRecord} />
      </EditDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={state.deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Usuń akt sprawy"
        message="Czy na pewno chcesz usunąć ten akt sprawy? Ta operacja jest nieodwracalna."
        confirmText="Usuń"
        type="delete"
      />
    </Container>
  );
}
