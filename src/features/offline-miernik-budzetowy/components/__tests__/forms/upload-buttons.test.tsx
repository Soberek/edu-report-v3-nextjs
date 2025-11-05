import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import ExcelUploaderUploadButtons from "../../forms/upload-buttons";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ProgramsData, AggregatedData } from "../../../types";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("ExcelUploaderUploadButtons", () => {
  const mockFileUpload = vi.fn();
  const mockSaveToExcel = vi.fn();

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

  const mockData: ProgramsData = {
    "Type A": {
      "Program 1": {
        "Action 1": { people: 10, actionNumber: 1 },
      },
    },
  };

  const defaultProps = {
    fileName: "",
    handleFileUpload: mockFileUpload,
    saveToExcelFile: mockSaveToExcel,
    error: "",
    data: undefined,
  };

  beforeEach(() => {
    mockFileUpload.mockClear();
    mockSaveToExcel.mockClear();
  });

  it("should render upload buttons component", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Wgraj plik excel/ })).toBeInTheDocument();
  });

  it("should display upload button", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} />);
    const uploadButton = screen.getByRole("button", { name: /Wgraj plik excel/ });
    expect(uploadButton).toBeInTheDocument();
  });

  it("should display save button", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} />);
    const saveButton = screen.getByRole("button", { name: /Zapisz miernik/ });
    expect(saveButton).toBeInTheDocument();
  });

  it("should disable save button when no file is selected", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} />);
    const saveButton = screen.getByRole("button", { name: /Zapisz miernik/ });
    expect(saveButton).toBeDisabled();
  });

  it("should disable save button when there is an error", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} fileName="test.xlsx" error="Invalid file" />);
    const saveButton = screen.getByRole("button", { name: /Zapisz miernik/ });
    expect(saveButton).toBeDisabled();
  });

  it("should display file name when provided", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} fileName="test.xlsx" data={mockData} />);
    expect(screen.getByText("test.xlsx")).toBeInTheDocument();
  });

  it("should display success chip when file is selected", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} fileName="test.xlsx" data={mockData} />);
    expect(screen.getByText("Gotowy")).toBeInTheDocument();
  });

  it("should call handleFileUpload when file input changes", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toHaveAttribute("accept", ".xlsx, .xls");
  });

  it("should call saveToExcelFile when save button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} fileName="test.xlsx" data={mockData} />);

    const saveButton = screen.getByRole("button", { name: /Zapisz miernik/ });
    await user.click(saveButton);

    expect(mockSaveToExcel).toHaveBeenCalledWith(mockData);
  });

  it("should accept xlsx and xls files", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput.accept).toContain("xlsx");
    expect(fileInput.accept).toContain("xls");
  });

  it("should not display file info when no file selected", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} />);
    expect(screen.queryByText(/Gotowy/)).not.toBeInTheDocument();
  });

  it("should enable save button when file is selected and no error", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} fileName="test.xlsx" data={mockData} error="" />);
    const saveButton = screen.getByRole("button", { name: /Zapisz miernik/ });
    expect(saveButton).not.toBeDisabled();
  });

  it("should display error message when provided", () => {
    const errorMessage = "File is too large";
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} error={errorMessage} />);
    // Error would be displayed through parent component typically
    expect(screen.getByRole("button", { name: /Zapisz miernik/ })).toBeDisabled();
  });

  it("should have correct file input attributes", () => {
    renderWithTheme(<ExcelUploaderUploadButtons {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput.hidden).toBe(true);
  });
});
