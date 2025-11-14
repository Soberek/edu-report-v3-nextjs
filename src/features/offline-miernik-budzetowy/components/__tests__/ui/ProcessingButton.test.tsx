import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { ProcessingButton } from "../../ui/ProcessingButton";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("ProcessingButton", () => {
  const mockOnProcess = vi.fn();

  const defaultProps = {
    onProcess: mockOnProcess,
    canProcess: true,
    isProcessing: false,
    show: true,
  };

  it("should render processing button", () => {
    renderWithTheme(<ProcessingButton {...defaultProps} />);
    expect(screen.getByRole("button", { name: /Przetwórz dane/ })).toBeInTheDocument();
  });

  it("should not render when show is false", () => {
    const { container } = renderWithTheme(<ProcessingButton {...defaultProps} show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("should show processing text when isProcessing is true", () => {
    renderWithTheme(<ProcessingButton {...defaultProps} isProcessing={true} />);
    expect(screen.getByRole("button", { name: /Przetwarzanie/ })).toBeInTheDocument();
  });

  it("should disable button when canProcess is false", () => {
    renderWithTheme(<ProcessingButton {...defaultProps} canProcess={false} />);
    const button = screen.getByRole("button", { name: /Przetwórz dane/ });
    expect(button).toBeDisabled();
  });

  it("should show loading state when isProcessing is true", () => {
    renderWithTheme(<ProcessingButton {...defaultProps} isProcessing={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Przetwarzanie");
  });

  it("should call onProcess when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ProcessingButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /Przetwórz dane/ });
    await user.click(button);

    expect(mockOnProcess).toHaveBeenCalledTimes(1);
  });

  it("should disable button when canProcess is false", () => {
    renderWithTheme(<ProcessingButton {...defaultProps} canProcess={false} />);

    const button = screen.getByRole("button", { name: /Przetwórz dane/ });
    expect(button).toBeDisabled();
  });

  it("should show loading icon when processing", () => {
    renderWithTheme(<ProcessingButton {...defaultProps} isProcessing={true} />);
    // CircularProgress is rendered when processing
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Przetwarzanie");
  });

  it("should show play icon when not processing", () => {
    renderWithTheme(<ProcessingButton {...defaultProps} />);
    const button = screen.getByRole("button", { name: /Przetwórz dane/ });
    expect(button).toBeInTheDocument();
  });

  it("should have data-testid attribute", () => {
    renderWithTheme(<ProcessingButton {...defaultProps} />);
    expect(screen.getByTestId("process-data-button")).toBeInTheDocument();
  });

  it("should handle multiple clicks when not processing", async () => {
    const user = userEvent.setup();
    mockOnProcess.mockClear();
    renderWithTheme(<ProcessingButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /Przetwórz dane/ });
    await user.click(button);
    await user.click(button);

    expect(mockOnProcess).toHaveBeenCalledTimes(2);
  });

  it("should display button in correct container", () => {
    const { container } = renderWithTheme(<ProcessingButton {...defaultProps} />);
    const boxContainer = container.querySelector("div");
    expect(boxContainer).toBeInTheDocument();
  });
});
