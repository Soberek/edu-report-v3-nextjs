import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BudgetMeterPage } from "../BudgetMeterPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const theme = createTheme();
const client = new QueryClient();

vi.mock("../hooks", () => ({
  useBudgetMeter: () => ({
    state: {
      fileName: "",
      rawData: [],
      isLoading: false,
      fileError: null,
      selectedMonths: [],
      monthError: null,
      aggregatedData: null,
      processingError: null,
      isProcessing: false,
    },
  }),
  useTabManager: () => ({
    activeTab: 2,
    handleTabChange: vi.fn(),
  }),
}));

describe("BudgetMeterPage", () => {
  it("renders main title", () => {
    render(
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          <BudgetMeterPage />
        </ThemeProvider>
      </QueryClientProvider>
    );
    expect(screen.getByText("Miernik Budżetowy oraz wskaźniki")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    expect(() => {
      render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={theme}>
            <BudgetMeterPage />
          </ThemeProvider>
        </QueryClientProvider>
      );
    }).not.toThrow();
  });
});
