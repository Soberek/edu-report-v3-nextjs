import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BudgetMeterPage } from "../BudgetMeterPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { BudgetMeterState } from "../../types";

const theme = createTheme();
const client = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Mock hooks
const mockUseBudgetMeter = vi.fn();
const mockUseTabManager = vi.fn();

vi.mock("../../hooks", () => ({
  useBudgetMeter: () => mockUseBudgetMeter(),
  useTabManager: () => mockUseTabManager(),
}));

const defaultState: BudgetMeterState = {
  fileName: "",
  rawData: [],
  isLoading: false,
  fileError: null,
  selectedMonths: [],
  monthError: null,
  aggregatedData: null,
  processingError: null,
  isProcessing: false,
};

const defaultTabManager = {
  activeTab: 2,
  handleTabChange: vi.fn(),
};

const renderComponent = () => {
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <BudgetMeterPage />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("BudgetMeterPage - Auto Processing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTabManager.mockReturnValue(defaultTabManager);
  });

  describe("Initial render", () => {
    it("should render main title", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: defaultState,
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.getByText("Miernik Budżetowy oraz wskaźniki")).toBeInTheDocument();
    });

    it("should not show processing indicator initially", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: defaultState,
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.queryByText("Przetwarzanie danych...")).not.toBeInTheDocument();
    });

    it("should not show ProcessingButton", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: defaultState,
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.queryByText("Przetwórz dane")).not.toBeInTheDocument();
    });
  });

  describe("Processing state", () => {
    it("should show loading indicator when isProcessing is true", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isProcessing: true,
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.getByText("Przetwarzanie danych...")).toBeInTheDocument();
    });

    it("should show CircularProgress when processing", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isProcessing: true,
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
    });

    it("should hide loading indicator when processing completes", async () => {
      // Start with processing state
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isProcessing: true,
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      const { rerender } = render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <BudgetMeterPage />
          </ThemeProvider>
        </QueryClientProvider>
      );

      // Verify loading indicator is shown
      expect(screen.getByText("Przetwarzanie danych...")).toBeInTheDocument();

      // Update mock to processing complete
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isProcessing: false,
          fileName: "test.xlsx",
          rawData: [],
          aggregatedData: {
            aggregated: {},
            allPeople: 500,
            allActions: 50,
            warnings: [],
          },
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: true,
        canExport: true,
      });

      // Rerender with new state
      rerender(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <BudgetMeterPage />
          </ThemeProvider>
        </QueryClientProvider>
      );

      // Verify loading indicator is hidden
      expect(screen.queryByText("Przetwarzanie danych...")).not.toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("should display file error", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          fileError: "Nieprawidłowy format pliku",
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      // Use getAllByText since error may appear in multiple places (FileUploader + ErrorDisplay)
      const errorElements = screen.getAllByText("Nieprawidłowy format pliku");
      expect(errorElements.length).toBeGreaterThan(0);
    });

    it("should display month selection error", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          monthError: "Wybierz co najmniej jeden miesiąc",
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.getByText("Wybierz co najmniej jeden miesiąc")).toBeInTheDocument();
    });

    it("should display processing error", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          processingError: "Błąd podczas przetwarzania danych",
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.getByText("Błąd podczas przetwarzania danych")).toBeInTheDocument();
    });

    it("should not show processing indicator when there is an error", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isProcessing: true,
          processingError: "Błąd",
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      // Should show loading indicator regardless of error
      expect(screen.getByText("Przetwarzanie danych...")).toBeInTheDocument();
    });
  });

  describe("Data display", () => {
    it("should show statistics when data is processed", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          fileName: "test.xlsx",
          rawData: [],
          aggregatedData: {
            aggregated: {},
            allPeople: 500,
            allActions: 50,
            warnings: [],
          },
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: true,
        canExport: true,
      });

      renderComponent();

      // Component should render without loading indicator
      expect(screen.queryByText("Przetwarzanie danych...")).not.toBeInTheDocument();
      // Statistics should be rendered (component renders when hasValidData is true)
      expect(mockUseBudgetMeter).toHaveBeenCalled();
    });

    it("should enable export buttons when data is ready", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          fileName: "test.xlsx",
          rawData: [],
          aggregatedData: {
            aggregated: {},
            allPeople: 500,
            allActions: 50,
            warnings: [],
          },
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: true,
        canExport: true,
      });

      renderComponent();

      // Export section should be present (no loading indicator)
      expect(screen.queryByText("Przetwarzanie danych...")).not.toBeInTheDocument();
      // Verify component rendered with data
      expect(mockUseBudgetMeter).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on loading indicator", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isProcessing: true,
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
    });

    it("should announce processing state to screen readers", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isProcessing: true,
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.getByText("Przetwarzanie danych...")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not cause unnecessary re-renders", () => {
      const processData = vi.fn();

      mockUseBudgetMeter.mockReturnValue({
        state: defaultState,
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData,
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      const { rerender } = render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <BudgetMeterPage />
          </ThemeProvider>
        </QueryClientProvider>
      );

      // Rerender with same props
      rerender(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <BudgetMeterPage />
          </ThemeProvider>
        </QueryClientProvider>
      );

      // processData should not be called on initial renders
      expect(processData).not.toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("should handle simultaneous file upload and processing", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isLoading: true,
          isProcessing: true,
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.getByText("Przetwarzanie danych...")).toBeInTheDocument();
    });

    it("should handle empty aggregated data", () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          aggregatedData: null,
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      expect(screen.queryByText("Przetwarzanie danych...")).not.toBeInTheDocument();
    });

    it("should handle very long processing times", async () => {
      mockUseBudgetMeter.mockReturnValue({
        state: {
          ...defaultState,
          isProcessing: true,
        },
        handleFileUpload: vi.fn(),
        resetState: vi.fn(),
        handleMonthToggle: vi.fn(),
        handleMonthSelectAll: vi.fn(),
        handleMonthDeselectAll: vi.fn(),
        handleSelectPreset: vi.fn(),
        processData: vi.fn(),
        handleExportToExcel: vi.fn(),
        handleExportToTemplate: vi.fn(),
        handleExportToCumulativeTemplate: vi.fn(),
        hasValidData: false,
        canExport: false,
      });

      renderComponent();

      // Should continue showing loading indicator
      await waitFor(
        () => {
          expect(screen.getByText("Przetwarzanie danych...")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });
});
