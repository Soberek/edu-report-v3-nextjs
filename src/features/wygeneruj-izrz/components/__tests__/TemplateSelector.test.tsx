import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { TemplateSelector } from "../TemplateSelector";
import type { TemplateSelectorProps, SelectedTemplate } from "../../types";
import { useTemplateManager } from "../../hooks/useTemplateManager";

// Mock the hooks and constants
vi.mock("../../hooks/useTemplateManager");

// Mock the constants
vi.mock("../../constants", () => ({
  TEMPLATE_CONSTANTS: {
    PREDEFINED_TEMPLATES: [
      { name: "izrz.docx", label: "IZRZ Template", description: "Szablon raportu IZRZ" },
      { name: "lista_obecnosci.docx", label: "Lista Obecności", description: "Szablon listy obecności" },
    ],
  },
  STYLE_CONSTANTS: {
    BORDER_RADIUS: {
      SMALL: 1.5,
    },
    COLORS: {
      PRIMARY: "#1976d2",
      SUCCESS: "#4caf50",
    },
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("TemplateSelector", () => {
  let mockOnTemplateSelect: ReturnType<typeof vi.fn>;
  let mockChoosePredefinedTemplate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnTemplateSelect = vi.fn();
    mockChoosePredefinedTemplate = vi.fn();

    vi.mocked(useTemplateManager).mockReturnValue({
      selectedTemplate: null,
      loading: false,
      error: null,
      choosePredefinedTemplate: mockChoosePredefinedTemplate,
      handleFileUpload: vi.fn(),
      clearTemplate: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps: TemplateSelectorProps = {
    onTemplateSelect: mockOnTemplateSelect,
  };

  describe("rendering", () => {
    it("should render template selector with title", () => {
      render(<TemplateSelector {...defaultProps} />);

      expect(screen.getByText("Wybierz szablon")).toBeInTheDocument();
      expect(screen.getByText("Wybierz jeden z dostępnych szablonów:")).toBeInTheDocument();
    });

    it("should render all predefined templates as buttons", () => {
      render(<TemplateSelector {...defaultProps} />);

      expect(screen.getByText("IZRZ Template")).toBeInTheDocument();
      expect(screen.getByText("Lista Obecności")).toBeInTheDocument();
    });

    it("should not show selected template display initially", () => {
      render(<TemplateSelector {...defaultProps} />);

      expect(screen.queryByText(/Wybrany szablon:/)).not.toBeInTheDocument();
    });
  });

  describe("template selection", () => {
    it("should call choosePredefinedTemplate when template button is clicked", async () => {
      mockChoosePredefinedTemplate.mockResolvedValue(undefined);

      render(<TemplateSelector {...defaultProps} />);

      const izrzButton = screen.getByText("IZRZ Template");
      fireEvent.click(izrzButton);

      expect(mockChoosePredefinedTemplate).toHaveBeenCalledWith("izrz.docx");
    });

    it("should handle template selection errors", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Template loading failed");
      mockChoosePredefinedTemplate.mockRejectedValue(error);

      render(<TemplateSelector {...defaultProps} />);

      const izrzButton = screen.getByText("IZRZ Template");
      fireEvent.click(izrzButton);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith("Failed to load template:", error);
      });

      consoleError.mockRestore();
    });

    it("should show loading state when template is being loaded", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: true,
        error: null,
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("selected template display", () => {
    const selectedTemplate: SelectedTemplate = {
      file: new File(["content"], "izrz.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
      name: "izrz.docx",
      size: 1024,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    it("should display selected template when provided", () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate={selectedTemplate} />);

      expect(screen.getByText("Wybrany szablon: izrz.docx")).toBeInTheDocument();
    });

    it("should not display selected template when not provided", () => {
      render(<TemplateSelector {...defaultProps} />);

      expect(screen.queryByText(/Wybrany szablon:/)).not.toBeInTheDocument();
    });

    it("should show correct template name in selected display", () => {
      const customTemplate: SelectedTemplate = {
        file: new File(["content"], "custom.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
        name: "custom.docx",
        size: 2048,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      render(<TemplateSelector {...defaultProps} selectedTemplate={customTemplate} />);

      expect(screen.getByText("Wybrany szablon: custom.docx")).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("should display internal error when provided", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: false,
        error: "Internal template error",
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} />);

      expect(screen.getByText("Internal template error")).toBeInTheDocument();
    });

    it("should display external error when provided", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: false,
        error: null,
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} error="External error" />);

      expect(screen.getByText("External error")).toBeInTheDocument();
    });

    it("should prioritize external error over internal error", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: false,
        error: "Internal error",
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} error="External error" />);

      expect(screen.getByText("External error")).toBeInTheDocument();
      expect(screen.queryByText("Internal error")).not.toBeInTheDocument();
    });

    it("should not display error when neither internal nor external error is provided", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: false,
        error: null,
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} />);

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("should show loading state from internal hook", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: true,
        error: null,
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it("should show loading state from external prop", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: false,
        error: null,
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} loading={true} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it("should show loading state when either internal or external loading is true", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: true,
        error: null,
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} loading={false} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("template button states", () => {
    it("should show template as selected when it matches selectedTemplate", () => {
      const selectedTemplate: SelectedTemplate = {
        file: new File(["content"], "izrz.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
        name: "izrz.docx",
        size: 1024,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      render(<TemplateSelector {...defaultProps} selectedTemplate={selectedTemplate} />);

      const izrzButton = screen.getByText("IZRZ Template");
      expect(izrzButton).toHaveClass("MuiButton-contained");
    });

    it("should show template as unselected when it does not match selectedTemplate", () => {
      const selectedTemplate: SelectedTemplate = {
        file: new File(["content"], "lista_obecnosci.docx", {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }),
        name: "lista_obecnosci.docx",
        size: 1024,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      render(<TemplateSelector {...defaultProps} selectedTemplate={selectedTemplate} />);

      const izrzButton = screen.getByText("IZRZ Template");
      expect(izrzButton).toHaveClass("MuiButton-outlined");
    });

    it("should show all templates as unselected when no template is selected", () => {
      render(<TemplateSelector {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("MuiButton-outlined");
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper button labels", () => {
      render(<TemplateSelector {...defaultProps} />);

      expect(screen.getByText("IZRZ Template")).toBeInTheDocument();
      expect(screen.getByText("Lista Obecności")).toBeInTheDocument();
    });

    it("should disable buttons when loading", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: true,
        error: null,
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("error display", () => {
    it("should display error with proper styling", () => {
      vi.mocked(useTemplateManager).mockReturnValue({
        loading: false,
        error: "Template loading failed",
        choosePredefinedTemplate: mockChoosePredefinedTemplate,
      });

      render(<TemplateSelector {...defaultProps} />);

      const errorAlert = screen.getByText("Template loading failed");
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert.closest(".MuiAlert-root")).toHaveClass("MuiAlert-standardError");
    });
  });

  describe("selected template styling", () => {
    it("should apply correct styling to selected template display", () => {
      const selectedTemplate: SelectedTemplate = {
        file: new File(["content"], "izrz.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
        name: "izrz.docx",
        size: 1024,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      render(<TemplateSelector {...defaultProps} selectedTemplate={selectedTemplate} />);

      const selectedDisplay = screen.getByText("Wybrany szablon: izrz.docx");
      expect(selectedDisplay).toBeInTheDocument();
      expect(selectedDisplay.closest("div")).toHaveStyle({
        backgroundColor: "#e8f5e8",
        border: "1px solid #4caf50",
      });
    });
  });
});
