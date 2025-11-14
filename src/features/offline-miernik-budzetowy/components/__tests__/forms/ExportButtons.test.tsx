import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { ExportButtons } from "../../forms/ExportButtons";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("ExportButtons", () => {
  const mockExport = vi.fn().mockResolvedValue(true);
  const mockExportToTemplate = vi.fn().mockResolvedValue(true);
  const mockExportToCumulativeTemplate = vi.fn().mockResolvedValue(true);

  const defaultProps = {
    onExport: mockExport,
    onExportToTemplate: mockExportToTemplate,
    onExportToCumulativeTemplate: mockExportToCumulativeTemplate,
    canExport: true,
    isProcessing: false,
  };

  beforeEach(() => {
    mockExport.mockClear();
    mockExportToTemplate.mockClear();
    mockExportToCumulativeTemplate.mockClear();
  });

  it("should render export buttons section", () => {
    renderWithTheme(<ExportButtons {...defaultProps} />);
    expect(screen.getByText("Eksportuj dane")).toBeInTheDocument();
  });

  it("should not render when canExport is false", () => {
    renderWithTheme(<ExportButtons {...defaultProps} canExport={false} />);
    expect(screen.queryByText("Eksportuj dane")).not.toBeInTheDocument();
  });

  it("should render three export buttons when canExport is true", () => {
    renderWithTheme(<ExportButtons {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Excel/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Miesięczny/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Narastający/ })).toBeInTheDocument();
  });

  it("should disable all buttons when isProcessing is true", () => {
    renderWithTheme(<ExportButtons {...defaultProps} isProcessing={true} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("should call onExport with custom filename when Excel button clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExportButtons {...defaultProps} />);

    const excelButton = screen.getByRole("button", { name: /Excel/ });
    await user.click(excelButton);

    expect(mockExport).toHaveBeenCalledWith("Bez szablonu miernik");
  });

  it("should call onExportToTemplate with custom filename when Template button clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExportButtons {...defaultProps} />);

    const templateButton = screen.getByRole("button", { name: /Miesięczny/ });
    await user.click(templateButton);

    expect(mockExportToTemplate).toHaveBeenCalled();
    expect(mockExportToTemplate.mock.calls[0][0]).toContain("Załacznik nr 1");
  });

  it("should allow filename customization", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExportButtons {...defaultProps} />);

    const excelInput = screen.getByLabelText("Nazwa pliku Excel") as HTMLInputElement;
    await user.tripleClick(excelInput);
    await user.keyboard("custom_name");

    const excelButton = screen.getByRole("button", { name: /Excel/ });
    await user.click(excelButton);

    expect(mockExport).toHaveBeenCalledWith("custom_name");
  });

  it("should render text fields for filename customization", () => {
    renderWithTheme(<ExportButtons {...defaultProps} />);
    expect(screen.getByLabelText("Nazwa pliku Excel")).toBeInTheDocument();
    expect(screen.getByLabelText("Nazwa pliku miesięcznego")).toBeInTheDocument();
    expect(screen.getByLabelText("Nazwa pliku narastającego")).toBeInTheDocument();
  });

  it("should disable text fields when isProcessing is true", () => {
    renderWithTheme(<ExportButtons {...defaultProps} isProcessing={true} />);
    expect(screen.getByLabelText("Nazwa pliku Excel")).toBeDisabled();
    expect(screen.getByLabelText("Nazwa pliku miesięcznego")).toBeDisabled();
    expect(screen.getByLabelText("Nazwa pliku narastającego")).toBeDisabled();
  });

  it("should handle export failure gracefully", async () => {
    const user = userEvent.setup();
    mockExport.mockResolvedValueOnce(false);

    renderWithTheme(<ExportButtons {...defaultProps} />);

    const excelButton = screen.getByRole("button", { name: /Excel/ });
    await user.click(excelButton);

    expect(mockExport).toHaveBeenCalled();
  });

  it("should call onExportToCumulativeTemplate when Cumulative button clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExportButtons {...defaultProps} />);

    const cumulativeButton = screen.getByRole("button", { name: /Narastający/ });
    await user.click(cumulativeButton);

    expect(mockExportToCumulativeTemplate).toHaveBeenCalled();
  });
});
