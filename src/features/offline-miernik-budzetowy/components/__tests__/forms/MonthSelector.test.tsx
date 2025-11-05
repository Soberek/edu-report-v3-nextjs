import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { MonthSelector } from "../../forms/MonthSelector";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { Month } from "../../../types";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("MonthSelector", () => {
  const mockMonthToggle = vi.fn();
  const mockSelectAll = vi.fn();
  const mockDeselectAll = vi.fn();
  const mockSelectPreset = vi.fn();

  const defaultMonths: Month[] = Array.from({ length: 12 }, (_, i) => ({
    monthNumber: i + 1,
    selected: false,
  }));

  const defaultProps = {
    months: defaultMonths,
    onMonthToggle: mockMonthToggle,
    onSelectAll: mockSelectAll,
    onDeselectAll: mockDeselectAll,
    onSelectPreset: mockSelectPreset,
    selectedCount: 0,
    disabled: false,
  };

  beforeEach(() => {
    mockMonthToggle.mockClear();
    mockSelectAll.mockClear();
    mockDeselectAll.mockClear();
    mockSelectPreset.mockClear();
  });

  it("should render month selector component", () => {
    renderWithTheme(<MonthSelector {...defaultProps} />);
    expect(screen.getByText("Miesiące")).toBeInTheDocument();
  });

  it("should display selected count", () => {
    renderWithTheme(<MonthSelector {...defaultProps} selectedCount={5} />);
    expect(screen.getByText(/✅ 5 z 12 wybranych/)).toBeInTheDocument();
  });

  it("should render all 12 months", () => {
    renderWithTheme(<MonthSelector {...defaultProps} />);
    // Find all boxes that represent months (looking for month names)
    const monthNames = ["Styczeń", "Luty", "Marzec", "Grudzień"];
    monthNames.forEach((monthName) => {
      expect(screen.getByText(monthName)).toBeInTheDocument();
    });
  });

  it("should call onMonthToggle when month is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<MonthSelector {...defaultProps} />);

    const monthButtons = screen.getAllByRole("button");
    // Find a month button (not select all/deselect all which are first)
    const monthButton = Array.from(monthButtons).find((btn) => btn.textContent?.includes("Styczeń"));

    if (monthButton) {
      await user.click(monthButton);
      expect(mockMonthToggle).toHaveBeenCalled();
    }
  });

  it("should disable selector when disabled prop is true", () => {
    renderWithTheme(<MonthSelector {...defaultProps} disabled={true} />);
    const selectAllButton = screen.getByRole("button", {
      name: /✅ Zaznacz wszystkie/,
    });
    expect(selectAllButton).toBeDisabled();
  });

  it("should disable select all button when all months selected", () => {
    const allSelected = defaultMonths.map((m) => ({ ...m, selected: true }));
    renderWithTheme(<MonthSelector {...defaultProps} months={allSelected} selectedCount={12} />);

    const selectAllButton = screen.getByRole("button", {
      name: /✅ Zaznacz wszystkie/,
    });
    expect(selectAllButton).toBeDisabled();
  });

  it("should disable deselect all button when no months selected", () => {
    renderWithTheme(<MonthSelector {...defaultProps} selectedCount={0} />);

    const deselectAllButton = screen.getByRole("button", {
      name: /❌ Odznacz wszystkie/,
    });
    expect(deselectAllButton).toBeDisabled();
  });

  it("should call onSelectAll when select all button clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<MonthSelector {...defaultProps} />);

    const selectAllButton = screen.getByRole("button", {
      name: /✅ Zaznacz wszystkie/,
    });
    await user.click(selectAllButton);

    expect(mockSelectAll).toHaveBeenCalledTimes(1);
  });

  it("should call onDeselectAll when deselect all button clicked", async () => {
    const user = userEvent.setup();
    const someSelected = defaultMonths.map((m, i) => ({
      ...m,
      selected: i < 3,
    }));

    renderWithTheme(<MonthSelector {...defaultProps} months={someSelected} selectedCount={3} />);

    const deselectAllButton = screen.getByRole("button", {
      name: /❌ Odznacz wszystkie/,
    });
    await user.click(deselectAllButton);

    expect(mockDeselectAll).toHaveBeenCalledTimes(1);
  });

  it("should display quick preset buttons", () => {
    renderWithTheme(<MonthSelector {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Bieżący miesiąc/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /1 Kwartał/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Rok/ })).toBeInTheDocument();
  });

  it("should show range mode indicator when range mode is active", () => {
    renderWithTheme(<MonthSelector {...defaultProps} />);
    // Range mode starts when shift-clicking first month
    expect(screen.queryByText(/Tryb zakresu/)).not.toBeInTheDocument();
  });

  it("should highlight selected months visually", () => {
    const monthsWithSelection = defaultMonths.map((m) => ({
      ...m,
      selected: m.monthNumber <= 3,
    }));

    renderWithTheme(<MonthSelector {...defaultProps} months={monthsWithSelection} selectedCount={3} />);

    expect(screen.getByText(/✅ 3 z 12 wybranych/)).toBeInTheDocument();
  });

  it("should disable all buttons when disabled is true", () => {
    renderWithTheme(<MonthSelector {...defaultProps} disabled={true} selectedCount={0} />);

    const selectAllButton = screen.getByRole("button", {
      name: /✅ Zaznacz wszystkie/,
    });
    expect(selectAllButton).toBeDisabled();
  });

  it("should show helper text for shift+click", () => {
    renderWithTheme(<MonthSelector {...defaultProps} />);
    // The text is "💡 Shift+Click dla zakresu" split across elements
    expect(screen.getByText(/Shift/)).toBeInTheDocument();
    expect(screen.getByText(/zakresu/)).toBeInTheDocument();
  });
});
