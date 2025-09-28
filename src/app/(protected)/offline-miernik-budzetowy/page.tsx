"use client";
import React, { useEffect } from "react";
import { Box, Typography, Alert, Button, CircularProgress, Container } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";

import { useBudgetMeter } from "./hooks/useBudgetMeter";
import { StatsCard, MonthSelector, FileUploader, DataTable } from "./components";

const OfflineMiernik: React.FC = () => {
  const {
    state,
    handleFileUpload,
    handleMonthToggle,
    handleMonthSelectAll,
    handleMonthDeselectAll,
    processData,
    handleExportToExcel,
    resetState,
    selectedMonthsCount,
    hasValidData,
    canProcess,
    canExport,
  } = useBudgetMeter();

  // Auto-process data when file and months are selected
  useEffect(() => {
    if (state.rawData.length > 0 && selectedMonthsCount > 0 && !state.aggregatedData) {
      processData();
    }
  }, [state.rawData.length, selectedMonthsCount, state.aggregatedData, processData]);

  const currentError = state.fileError || state.monthError || state.processingError;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
          Miernik Budżetowy
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Analizuj dane programów edukacyjnych z plików Excel. Wybierz miesiące, wczytaj dane i wygeneruj raporty.
        </Typography>
      </Box>

      {/* File Upload Section */}
      <FileUploader
        fileName={state.fileName}
        onFileUpload={handleFileUpload}
        onExport={handleExportToExcel}
        onReset={resetState}
        isLoading={state.isLoading}
        isProcessing={state.isProcessing}
        canExport={canExport ?? false}
        error={state.fileError}
      />

      {/* Month Selection */}
      {state.rawData.length > 0 && (
        <MonthSelector
          months={state.selectedMonths}
          onMonthToggle={handleMonthToggle}
          onSelectAll={handleMonthSelectAll}
          onDeselectAll={handleMonthDeselectAll}
          selectedCount={selectedMonthsCount}
          disabled={!!currentError}
        />
      )}

      {/* Manual Process Button */}
      {state.rawData.length > 0 && selectedMonthsCount > 0 && !state.aggregatedData && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={processData}
            disabled={!canProcess}
            startIcon={state.isProcessing ? <CircularProgress size={20} /> : <PlayArrow />}
            sx={{ px: 4, py: 2 }}
          >
            {state.isProcessing ? "Przetwarzanie..." : "Przetwórz dane"}
          </Button>
        </Box>
      )}

      {/* Error Display */}
      {currentError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {currentError}
        </Alert>
      )}

      {/* Statistics Cards */}
      {hasValidData && state.aggregatedData && (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <StatsCard icon="📊" label="Ogólna liczba działań" value={state.aggregatedData.allActions} color="primary" />
          <StatsCard icon="👥" label="Ogólna liczba odbiorców" value={state.aggregatedData.allPeople} color="success" />
        </Box>
      )}

      {/* Data Table */}
      {hasValidData && state.aggregatedData && (
        <DataTable
          data={state.aggregatedData.aggregated}
          allActions={state.aggregatedData.allActions}
          allPeople={state.aggregatedData.allPeople}
        />
      )}

      {/* Empty State */}
      {!state.rawData.length && !currentError && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Rozpocznij od wczytania pliku Excel
          </Typography>
          <Typography variant="body1">Wybierz plik z danymi programów edukacyjnych, aby rozpocząć analizę</Typography>
        </Box>
      )}
    </Container>
  );
};

export default OfflineMiernik;
