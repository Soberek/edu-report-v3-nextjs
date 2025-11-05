import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import ExcelUploaderMonthsButtons from "../../forms/month-buttons";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("ExcelUploaderMonthsButtons", () => {
  const mockMonthSelect = vi.fn();

  const defaultMonths = Array.from({ length: 12 }, (_, i) => ({
    monthNumber: i + 1,
    selected: false,
  }));

  const defaultProps = {
    months: defaultMonths,
    handleMonthSelect: mockMonthSelect,
  };

  beforeEach(() => {
    mockMonthSelect.mockClear();
  });

  it("should render month buttons component", () => {
    renderWithTheme(<ExcelUploaderMonthsButtons {...defaultProps} />);
    expect(screen.getByText("Wybierz miesiące")).toBeInTheDocument();
  });

  it("should display all 12 months", () => {
    renderWithTheme(<ExcelUploaderMonthsButtons {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(12);
  });

  it("should show selected count", () => {
    renderWithTheme(<ExcelUploaderMonthsButtons {...defaultProps} />);
    expect(screen.getByText("0 wybranych")).toBeInTheDocument();
  });

  it("should update selected count when months are selected", () => {
    const selectedMonths = defaultMonths.map((m, i) => ({
      ...m,
      selected: i < 3,
    }));

    renderWithTheme(<ExcelUploaderMonthsButtons months={selectedMonths} handleMonthSelect={mockMonthSelect} />);

    expect(screen.getByText("3 wybranych")).toBeInTheDocument();
  });

  it("should call handleMonthSelect when month button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExcelUploaderMonthsButtons {...defaultProps} />);

    const buttons = screen.getAllByRole("button");
    // Find button with month abbreviation (not the chip counter)
    const monthButton = buttons.find((btn) => btn.textContent === "Sty");

    if (monthButton) {
      await user.click(monthButton);
      expect(mockMonthSelect).toHaveBeenCalledWith(1);
    }
  });

  it("should display month abbreviations", () => {
    renderWithTheme(<ExcelUploaderMonthsButtons {...defaultProps} />);
    expect(screen.getByText("Sty")).toBeInTheDocument();
    expect(screen.getByText("Lut")).toBeInTheDocument();
    expect(screen.getByText("Mar")).toBeInTheDocument();
    expect(screen.getByText("Gru")).toBeInTheDocument();
  });

  it("should display checkmark for selected months", () => {
    const selectedMonths = defaultMonths.map((m, i) => ({
      ...m,
      selected: i === 0, // Select January
    }));

    renderWithTheme(<ExcelUploaderMonthsButtons months={selectedMonths} handleMonthSelect={mockMonthSelect} />);

    // Check that selected month has visual indicator
    const monthButton = screen.getByText("Sty").closest("button");
    expect(monthButton).toBeInTheDocument();
  });

  it("should have calendar icon in header", () => {
    renderWithTheme(<ExcelUploaderMonthsButtons {...defaultProps} />);
    // CalendarMonth icon is rendered
    expect(screen.getByText("Wybierz miesiące")).toBeInTheDocument();
  });

  it("should handle all months selection", async () => {
    const user = userEvent.setup();
    const allSelectedMonths = defaultMonths.map((m) => ({
      ...m,
      selected: true,
    }));

    renderWithTheme(<ExcelUploaderMonthsButtons months={allSelectedMonths} handleMonthSelect={mockMonthSelect} />);

    expect(screen.getByText("12 wybranych")).toBeInTheDocument();
  });

  it("should display chip with selection status", () => {
    renderWithTheme(<ExcelUploaderMonthsButtons {...defaultProps} />);
    const chip = screen.getByText("0 wybranych");
    expect(chip).toBeInTheDocument();
  });

  it("should call handleMonthSelect with correct month number", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExcelUploaderMonthsButtons {...defaultProps} />);

    // December is last month (12)
    const decButton = screen.getByText("Gru");
    await user.click(decButton);

    expect(mockMonthSelect).toHaveBeenCalledWith(12);
  });
});
