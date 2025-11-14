import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { StatisticsCards } from "../../ui/StatisticsCards";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { AggregatedData } from "../../../types";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("StatisticsCards", () => {
  const mockAggregatedData: AggregatedData = {
    aggregated: {
      "Type A": {
        "Program 1": {
          "Action 1": { people: 10, actionNumber: 1 },
        },
      },
    },
    allPeople: 100,
    allActions: 25,
  };

  it("should render statistics cards when show is true", () => {
    renderWithTheme(<StatisticsCards data={mockAggregatedData} show={true} />);
    expect(screen.getByText("Ogólna liczba działań")).toBeInTheDocument();
    expect(screen.getByText("Ogólna liczba odbiorców")).toBeInTheDocument();
  });

  it("should not render when show is false", () => {
    const { container } = renderWithTheme(<StatisticsCards data={mockAggregatedData} show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("should display correct action count", () => {
    renderWithTheme(<StatisticsCards data={mockAggregatedData} show={true} />);
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("should display correct people count", () => {
    renderWithTheme(<StatisticsCards data={mockAggregatedData} show={true} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should handle zero values", () => {
    const zeroData: AggregatedData = {
      ...mockAggregatedData,
      allPeople: 0,
      allActions: 0,
    };

    renderWithTheme(<StatisticsCards data={zeroData} show={true} />);
    expect(screen.getAllByText("0")).toHaveLength(2);
  });

  it("should handle large numbers", () => {
    const largeData: AggregatedData = {
      ...mockAggregatedData,
      allPeople: 999999,
      allActions: 5000,
    };

    renderWithTheme(<StatisticsCards data={largeData} show={true} />);
    expect(screen.getByText("999999")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
  });

  it("should render StatsCard components", () => {
    renderWithTheme(<StatisticsCards data={mockAggregatedData} show={true} />);
    // Check for both titles which indicate StatsCard components are rendered
    const titles = [screen.getByText("Ogólna liczba działań"), screen.getByText("Ogólna liczba odbiorców")];
    titles.forEach((title) => {
      expect(title).toBeInTheDocument();
    });
  });

  it("should maintain data consistency", () => {
    const customData: AggregatedData = {
      ...mockAggregatedData,
      allPeople: 42,
      allActions: 7,
    };

    renderWithTheme(<StatisticsCards data={customData} show={true} />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("should handle warnings in data", () => {
    const dataWithWarnings: AggregatedData = {
      ...mockAggregatedData,
      warnings: ["Warning 1", "Warning 2"],
    };

    // Should still render without errors
    renderWithTheme(<StatisticsCards data={dataWithWarnings} show={true} />);
    expect(screen.getByText("Ogólna liczba działań")).toBeInTheDocument();
  });
});
