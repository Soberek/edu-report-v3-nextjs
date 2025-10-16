import React, { useEffect, memo } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { useBudgetMeter, useTabManager } from "../hooks";
import { FileUploader, MonthSelector, ExportButtons, ProcessingButton, StatisticsCards, TabNavigation, TabContent } from "./";
import { EmptyState, PageHeader } from "@/components/shared";
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
    handleSelectPreset,
    processData,
    handleExportToExcel,
    handleExportToTemplate,
    handleExportToCumulativeTemplate,
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
      <PageHeader title="Miernik Budżetowy oraz wskaźniki" />

            <FileUploadSection
        state={state}
        onFileUpload={handleFileUpload}
        onReset={resetState}
      />

      <MonthSelectionSection
        state={state}
        selectedMonthsCount={selectedMonthsCount}
        currentError={currentError}
        onMonthToggle={handleMonthToggle}
        onSelectAll={handleMonthSelectAll}
        onDeselectAll={handleMonthDeselectAll}
        onSelectPreset={handleSelectPreset}
      />

      <ExportSection
        canExport={canExport ?? false}
        isProcessing={state.isProcessing}
        onExport={handleExportToExcel}
        onExportToTemplate={handleExportToTemplate}
        onExportToCumulativeTemplate={handleExportToCumulativeTemplate}
      />

      <ProcessingButton show={showProcessingButton} onProcess={processData} canProcess={canProcess} isProcessing={state.isProcessing} />

      <ErrorDisplay error={currentError} />

      <StatisticsCards show={showStatistics} data={state.aggregatedData!} />

      <DataVisualization show={showDataVisualization} activeTab={activeTab} onTabChange={handleTabChange} state={state} />

      {showEmptyState && (
        <EmptyState
          title="Rozpocznij od wczytania pliku Excel"
          description="Wybierz plik z danymi programów edukacyjnych, aby rozpocząć analizę"
        />
      )}
    </Container>
  );
};



/**
 * File upload section props
 */
interface FileUploadSectionProps {
  readonly state: ReturnType<typeof useBudgetMeter>["state"];
  readonly onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onReset: () => void;
}

/**
 * File upload section component
 */
const FileUploadSection: React.FC<FileUploadSectionProps> = memo(({ state, onFileUpload, onReset }) => (
  <FileUploader
    fileName={state.fileName}
    onFileUpload={onFileUpload}
    onReset={onReset}
    isLoading={state.isLoading}
    isProcessing={state.isProcessing}
    error={state.fileError}
  />
));

FileUploadSection.displayName = "FileUploadSection";

/**
 * Export section props
 */
interface ExportSectionProps {
  readonly canExport: boolean;
  readonly isProcessing: boolean;
  readonly onExport: (customFileName?: string) => Promise<boolean>;
  readonly onExportToTemplate: (customFileName?: string) => Promise<boolean>;
  readonly onExportToCumulativeTemplate: (customFileName?: string) => Promise<boolean>;
}

/**
 * Export section component
 */
const ExportSection: React.FC<ExportSectionProps> = memo(({
  canExport,
  isProcessing,
  onExport,
  onExportToTemplate,
  onExportToCumulativeTemplate,
}) => (
  <ExportButtons
    canExport={canExport}
    isProcessing={isProcessing}
    onExport={onExport}
    onExportToTemplate={onExportToTemplate}
    onExportToCumulativeTemplate={onExportToCumulativeTemplate}
  />
));

ExportSection.displayName = "ExportSection";

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
  readonly onSelectPreset?: (monthNumbers: number[]) => void;
}

/**
 * Month selection section component
 */
const MonthSelectionSection: React.FC<MonthSelectionSectionProps> = memo(({
  state,
  selectedMonthsCount,
  currentError,
  onMonthToggle,
  onSelectAll,
  onDeselectAll,
  onSelectPreset,
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
      onSelectPreset={onSelectPreset}
      selectedCount={selectedMonthsCount}
      disabled={!!currentError}
    />
  );
});

MonthSelectionSection.displayName = "MonthSelectionSection";

/**
 * Error display component
 */
interface ErrorDisplayProps {
  readonly error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = memo(({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ mb: UI_CONFIG.SECTION_SPACING }}>
      {error}
    </Alert>
  );
});

ErrorDisplay.displayName = "ErrorDisplay";

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
const DataVisualization: React.FC<DataVisualizationProps> = memo(({ show, activeTab, onTabChange, state }) => {
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
});

DataVisualization.displayName = "DataVisualization";

export default BudgetMeterPage;
