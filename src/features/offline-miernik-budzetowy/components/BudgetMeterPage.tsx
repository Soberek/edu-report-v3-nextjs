import React, { useEffect } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { useBudgetMeter, useTabManager } from "../hooks";
import { FileUploader, MonthSelector, ProcessingButton, StatisticsCards, TabNavigation, TabContent, EmptyState } from "./";
import { UI_CONFIG, AUTO_PROCESSING } from "../constants";
import { canProcessData, getSelectedMonthsCount, shouldAutoProcess, getCurrentError } from "../utils";

/**
 * Main Budget Meter page component
 * Orchestrates the budget analysis workflow with clean separation of concerns
 */
export const BudgetMeterPage: React.FC = () => {
  const { activeTab, handleTabChange } = useTabManager();

  const {
    state,
    handleFileUpload,
    handleMonthToggle,
    handleMonthSelectAll,
    handleMonthDeselectAll,
    processData,
    handleExportToExcel,
    resetState,
    hasValidData,
    canProcess,
    canExport,
  } = useBudgetMeter();

  // Derived state
  const selectedMonthsCount = getSelectedMonthsCount(state.selectedMonths);
  const currentError = getCurrentError(state.fileError, state.monthError, state.processingError);
  const showProcessingButton = canProcessData(state.rawData, state.selectedMonths, state.aggregatedData);
  const showStatistics = Boolean(hasValidData && state.aggregatedData);
  const showDataVisualization = Boolean(hasValidData && state.aggregatedData);
  const showEmptyState = !state.rawData.length && !currentError;

  // Auto-process data when conditions are met
  useEffect(() => {
    if (shouldAutoProcess(state.rawData.length, selectedMonthsCount, state.aggregatedData, AUTO_PROCESSING.ENABLED)) {
      processData();
    }
  }, [state.rawData.length, selectedMonthsCount, state.aggregatedData, processData]);

  return (
    <Container maxWidth={UI_CONFIG.CONTAINER_MAX_WIDTH} sx={{ py: 4 }}>
      <PageHeader />

      <FileUploadSection
        state={state}
        onFileUpload={handleFileUpload}
        onExport={handleExportToExcel}
        onReset={resetState}
        canExport={canExport ?? false}
      />

      <MonthSelectionSection
        state={state}
        selectedMonthsCount={selectedMonthsCount}
        currentError={currentError}
        onMonthToggle={handleMonthToggle}
        onSelectAll={handleMonthSelectAll}
        onDeselectAll={handleMonthDeselectAll}
      />

      <ProcessingButton show={showProcessingButton} onProcess={processData} canProcess={canProcess} isProcessing={state.isProcessing} />

      <ErrorDisplay error={currentError} />

      <StatisticsCards show={showStatistics} data={state.aggregatedData!} />

      <DataVisualization show={showDataVisualization} activeTab={activeTab} onTabChange={handleTabChange} state={state} />

      <EmptyState show={showEmptyState} />
    </Container>
  );
};

/**
 * Page header section component
 */
const PageHeader: React.FC = () => (
  <Box sx={{ mb: UI_CONFIG.HEADER_SPACING, textAlign: "center" }}>
    <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
      Miernik Budżetowy
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
      Analizuj dane programów edukacyjnych z plików Excel. Wybierz miesiące, wczytaj dane i wygeneruj raporty.
    </Typography>
  </Box>
);

/**
 * File upload section props
 */
interface FileUploadSectionProps {
  readonly state: ReturnType<typeof useBudgetMeter>["state"];
  readonly onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onExport: () => Promise<boolean>;
  readonly onReset: () => void;
  readonly canExport: boolean;
}

/**
 * File upload section component
 */
const FileUploadSection: React.FC<FileUploadSectionProps> = ({ state, onFileUpload, onExport, onReset, canExport }) => (
  <FileUploader
    fileName={state.fileName}
    onFileUpload={onFileUpload}
    onExport={onExport}
    onReset={onReset}
    isLoading={state.isLoading}
    isProcessing={state.isProcessing}
    canExport={canExport}
    error={state.fileError}
  />
);

/**
 * Month selection section props
 */
interface MonthSelectionSectionProps {
  readonly state: ReturnType<typeof useBudgetMeter>["state"];
  readonly selectedMonthsCount: number;
  readonly currentError: string | null;
  readonly onMonthToggle: (monthNumber: number) => void;
  readonly onSelectAll: () => void;
  readonly onDeselectAll: () => void;
}

/**
 * Month selection section component
 */
const MonthSelectionSection: React.FC<MonthSelectionSectionProps> = ({
  state,
  selectedMonthsCount,
  currentError,
  onMonthToggle,
  onSelectAll,
  onDeselectAll,
}) => {
  if (state.rawData.length === 0) {
    return null;
  }

  return (
    <MonthSelector
      months={state.selectedMonths}
      onMonthToggle={onMonthToggle}
      onSelectAll={onSelectAll}
      onDeselectAll={onDeselectAll}
      selectedCount={selectedMonthsCount}
      disabled={!!currentError}
    />
  );
};

/**
 * Error display component
 */
interface ErrorDisplayProps {
  readonly error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ mb: UI_CONFIG.SECTION_SPACING }}>
      {error}
    </Alert>
  );
};

/**
 * Data visualization section props
 */
interface DataVisualizationProps {
  readonly show: boolean;
  readonly activeTab: ReturnType<typeof useTabManager>["activeTab"];
  readonly onTabChange: ReturnType<typeof useTabManager>["handleTabChange"];
  readonly state: ReturnType<typeof useBudgetMeter>["state"];
}

/**
 * Data visualization section component
 */
const DataVisualization: React.FC<DataVisualizationProps> = ({ show, activeTab, onTabChange, state }) => {
  if (!show) {
    return null;
  }

  return (
    <Box sx={{ mb: UI_CONFIG.SECTION_SPACING }}>
      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
      <TabContent
        activeTab={activeTab}
        aggregatedData={state.aggregatedData!}
        selectedMonths={state.selectedMonths}
        rawData={state.rawData}
      />
    </Box>
  );
};

export default BudgetMeterPage;
