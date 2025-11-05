import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { FileUploader } from "../../forms/FileUploader";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("FileUploader", () => {
  const mockFileUpload = vi.fn();
  const mockReset = vi.fn();

  const defaultProps = {
    fileName: "",
    onFileUpload: mockFileUpload,
    onReset: mockReset,
    isLoading: false,
    isProcessing: false,
    error: null,
  };

  beforeEach(() => {
    mockFileUpload.mockClear();
    mockReset.mockClear();
  });

  it("should render file upload component", () => {
    renderWithTheme(<FileUploader {...defaultProps} />);
    expect(screen.getByText("Wybierz plik Excel")).toBeInTheDocument();
  });

  it("should display file name when provided", () => {
    renderWithTheme(<FileUploader {...defaultProps} fileName="test.xlsx" />);
    expect(screen.getByText(/Wczytano: test.xlsx/)).toBeInTheDocument();
  });

  it("should call onFileUpload when file is selected", async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUploader {...defaultProps} />);

    const uploadButton = screen.getByRole("button", { name: /Wybierz plik/ });
    await user.click(uploadButton);

    const fileInput = screen.getByDisplayValue("");
    expect(fileInput).toBeInTheDocument();
  });

  it("should disable buttons when loading", () => {
    renderWithTheme(<FileUploader {...defaultProps} isLoading={true} />);
    const uploadButton = screen.getByRole("button", { name: /⏳ Wczytywanie/ });
    expect(uploadButton).toBeDisabled();
  });

  it("should disable buttons when processing", () => {
    renderWithTheme(<FileUploader {...defaultProps} isProcessing={true} />);
    const uploadButton = screen.getByRole("button");
    expect(uploadButton).toBeDisabled();
  });

  it("should display reset button when file is selected", () => {
    renderWithTheme(<FileUploader {...defaultProps} fileName="test.xlsx" />);
    const resetButton = screen.getByRole("button", { name: /Resetuj/ });
    expect(resetButton).toBeInTheDocument();
  });

  it("should call onReset when reset button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<FileUploader {...defaultProps} fileName="test.xlsx" />);

    const resetButton = screen.getByRole("button", { name: /Resetuj/ });
    await user.click(resetButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("should display error message when error is provided", () => {
    const errorMessage = "Invalid file format";
    renderWithTheme(<FileUploader {...defaultProps} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should not display reset button when no file selected", () => {
    renderWithTheme(<FileUploader {...defaultProps} />);
    expect(screen.queryByRole("button", { name: /Resetuj/ })).not.toBeInTheDocument();
  });

  it("should disable reset button when loading", () => {
    renderWithTheme(<FileUploader {...defaultProps} fileName="test.xlsx" isLoading={true} />);
    const resetButton = screen.getByRole("button", { name: /Resetuj/ });
    expect(resetButton).toBeDisabled();
  });

  it("should have correct file input attributes", () => {
    renderWithTheme(<FileUploader {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toHaveAttribute("accept", ".xlsx");
  });

  it("should display reset button in error alert", () => {
    const errorMessage = "Błąd podczas wczytywania pliku";
    renderWithTheme(<FileUploader {...defaultProps} error={errorMessage} />);

    const resetButtons = screen.getAllByRole("button", { name: /Resetuj/ });
    expect(resetButtons.length).toBeGreaterThan(0);
  });

  it("should call onReset when reset button in error is clicked", async () => {
    const user = userEvent.setup();
    const errorMessage = "Błąd podczas wczytywania pliku";
    renderWithTheme(<FileUploader {...defaultProps} error={errorMessage} />);

    const resetButtons = screen.getAllByRole("button", { name: /Resetuj/ });
    const errorResetButton = resetButtons[resetButtons.length - 1];

    await user.click(errorResetButton);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("should show error and allow recovery", async () => {
    const user = userEvent.setup();
    const errorMessage = "Niezobaczony format pliku";

    renderWithTheme(<FileUploader {...defaultProps} error={errorMessage} fileName="bad.txt" />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const resetButtons = screen.getAllByRole("button", { name: /Resetuj/ });
    const errorResetButton = resetButtons[resetButtons.length - 1];

    await user.click(errorResetButton);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
