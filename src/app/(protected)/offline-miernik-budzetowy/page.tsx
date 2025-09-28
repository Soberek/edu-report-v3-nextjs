"use client";
import React, { useEffect } from "react";
import { Box, Typography, Alert, Button, CircularProgress, Container } from "@mui/material";
import { PlayArrow, BarChart } from "@mui/icons-material";
import Link from "next/link";

import { useBudgetMeter } from "./hooks/useBudgetMeter";
import { StatsCard, MonthSelector, FileUploader, DataTable, AdvancedStats } from "./components";

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
          
          {/* Statistics Page Link */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: 3,
              backgroundColor: "info.light",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "info.main",
              minWidth: 250,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "info.main",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Link
              href="/offline-miernik-budzetowy/statistics"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  backgroundColor: "info.main",
                  borderRadius: "50%",
                  color: "white",
                }}
              >
                <BarChart />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "0.75rem" }}>
                  Statystyki
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "info.main", lineHeight: 1.2 }}>
                  Wykresy słupkowe
                </Typography>
              </Box>
            </Link>
          </Box>
        </Box>
      )}

      {/* Advanced Statistics */}
      {hasValidData && state.aggregatedData && (
        <AdvancedStats data={state.aggregatedData} selectedMonths={state.selectedMonths} rawData={state.rawData} />
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
