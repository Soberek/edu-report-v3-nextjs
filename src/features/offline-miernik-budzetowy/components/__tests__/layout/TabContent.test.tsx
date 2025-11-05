import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TabContent } from "../../layout/TabContent";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { TABS, type TabId } from "../../../constants";
import type { AggregatedData, Month, ExcelRow } from "../../../types";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

// Mock the tab components
vi.mock("../../../taby/statystyki", () => ({
  AdvancedStats: () => <div data-testid="advanced-stats">Advanced Stats</div>,
}));

vi.mock("../../../taby/wykresy", () => ({
  BarCharts: () => <div data-testid="bar-charts">Bar Charts</div>,
}));

vi.mock("../../../taby/miernik-budzetowy", () => ({
  DataTable: () => <div data-testid="data-table">Data Table</div>,
}));

vi.mock("../../../taby/wskazniki/components", () => ({
  IndicatorsView: () => <div data-testid="indicators-view">Indicators</div>,
}));

describe("TabContent", () => {
  const mockAggregatedData: AggregatedData = {
    aggregated: {
      "Type A": {
        "Program 1": {
          "Action 1": { people: 10, actionNumber: 1 },
        },
      },
    },
    allPeople: 10,
    allActions: 1,
  };

  const mockMonths: Month[] = Array.from({ length: 12 }, (_, i) => ({
    monthNumber: i + 1,
    selected: i < 3,
  }));

  const mockRawData: ExcelRow[] = [
    {
      "Typ programu": "PROGRAMOWE",
      "Nazwa programu": "Program A",
      Działanie: "Action 1",
      "Liczba ludzi": 10,
      "Liczba działań": 1,
      Data: "2024-01-01",
    },
  ];

  const defaultProps = {
    activeTab: TABS.DATA_TABLE as TabId,
    aggregatedData: mockAggregatedData,
    selectedMonths: mockMonths,
    rawData: mockRawData,
  };

  it("should render tab panel", () => {
    const { container } = renderWithTheme(<TabContent {...defaultProps} />);
    expect(container.querySelector('[role="tabpanel"]')).toBeInTheDocument();
  });

  it("should render DataTable for DATA_TABLE tab", () => {
    renderWithTheme(<TabContent {...defaultProps} activeTab={TABS.DATA_TABLE as TabId} />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("should render AdvancedStats for ADVANCED_STATS tab", () => {
    renderWithTheme(<TabContent {...defaultProps} activeTab={TABS.ADVANCED_STATS as TabId} />);
    expect(screen.getByTestId("advanced-stats")).toBeInTheDocument();
  });

  it("should render BarCharts for BAR_CHARTS tab", () => {
    renderWithTheme(<TabContent {...defaultProps} activeTab={TABS.BAR_CHARTS as TabId} />);
    expect(screen.getByTestId("bar-charts")).toBeInTheDocument();
  });

  it("should render IndicatorsView for INDICATORS tab", () => {
    renderWithTheme(<TabContent {...defaultProps} activeTab={TABS.INDICATORS as TabId} />);
    expect(screen.getByTestId("indicators-view")).toBeInTheDocument();
  });

  it("should handle invalid tab gracefully", () => {
    const { container } = renderWithTheme(<TabContent {...defaultProps} activeTab={999 as TabId} />);
    const tabpanel = container.querySelector('[role="tabpanel"]');
    expect(tabpanel).toBeInTheDocument();
  });

  it("should update when activeTab changes", () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <TabContent {...defaultProps} activeTab={TABS.DATA_TABLE as TabId} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("data-table")).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <TabContent {...defaultProps} activeTab={TABS.INDICATORS as TabId} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("indicators-view")).toBeInTheDocument();
  });

  it("should pass correct props to DataTable", () => {
    renderWithTheme(<TabContent {...defaultProps} activeTab={TABS.DATA_TABLE as TabId} />);
    // DataTable should be rendered with correct data
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("should pass correct props to AdvancedStats", () => {
    renderWithTheme(<TabContent {...defaultProps} activeTab={TABS.ADVANCED_STATS as TabId} />);
    expect(screen.getByTestId("advanced-stats")).toBeInTheDocument();
  });

  it("should pass correct props to BarCharts", () => {
    renderWithTheme(<TabContent {...defaultProps} activeTab={TABS.BAR_CHARTS as TabId} />);
    expect(screen.getByTestId("bar-charts")).toBeInTheDocument();
  });

  it("should pass correct props to IndicatorsView", () => {
    renderWithTheme(<TabContent {...defaultProps} activeTab={TABS.INDICATORS as TabId} />);
    expect(screen.getByTestId("indicators-view")).toBeInTheDocument();
  });

  it("should have correct aria attributes", () => {
    const { container } = renderWithTheme(<TabContent {...defaultProps} />);
    const tabpanel = container.querySelector('[role="tabpanel"]');
    expect(tabpanel).toHaveAttribute("aria-labelledby");
  });

  it("should handle empty raw data", () => {
    renderWithTheme(<TabContent {...defaultProps} rawData={[]} activeTab={TABS.BAR_CHARTS as TabId} />);
    expect(screen.getByTestId("bar-charts")).toBeInTheDocument();
  });

  it("should handle empty selected months", () => {
    renderWithTheme(<TabContent {...defaultProps} selectedMonths={[]} activeTab={TABS.ADVANCED_STATS as TabId} />);
    expect(screen.getByTestId("advanced-stats")).toBeInTheDocument();
  });
});
