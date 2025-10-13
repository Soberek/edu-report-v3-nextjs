import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Setup DOM environment for integration tests
beforeEach(() => {
  // Ensure document.body exists
  if (!document.body) {
    const body = document.createElement("body");
    document.documentElement.appendChild(body);
  }
});
import { useCombinedForm } from "../hooks/useCombinedForm";
import { TemplateSelector, FormField } from "../components";
import { izrzFormSchema, type IzrzFormData } from "../schemas/izrzSchemas";
import { formatFileSize, isValidTemplateFile } from "../utils";

// Mock the constants
vi.mock("../constants", () => ({
  UI_CONSTANTS: {
    SUBMIT_MESSAGE_DURATION: 100,
    MAX_FILE_SIZE: 10 * 1024 * 1024,
  },
  TEMPLATE_CONSTANTS: {
    ALLOWED_FILE_TYPES: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"],
    PREDEFINED_TEMPLATES: [{ name: "izrz.docx", label: "IZRZ Template", description: "Szablon raportu IZRZ" }],
  },
  API_CONSTANTS: {
    GENERATE_IZRZ_ENDPOINT: "/api/generate-izrz",
    TEMPLATE_BASE_PATH: "/generate-templates",
  },
  MESSAGES: {
    SUCCESS: {
      REPORT_GENERATED: "Raport został wygenerowany! Pobieranie rozpoczęte.",
    },
    ERROR: {
      GENERATION_FAILED: "Błąd podczas generowania raportu. Spróbuj ponownie.",
      FILE_TOO_LARGE: "Plik jest zbyt duży. Maksymalny rozmiar to 10MB.",
      INVALID_FILE_TYPE: "Nieprawidłowy typ pliku. Dozwolone są tylko pliki .docx",
    },
  },
  STYLE_CONSTANTS: {
    BORDER_RADIUS: { SMALL: 1.5 },
    FONT_SIZES: { SMALL: "0.8rem", MEDIUM: "0.9rem" },
    COLORS: { PRIMARY: "#1976d2", SUCCESS: "#4caf50" },
  },
  FORM_CONSTANTS: {
    TEXTAREA_ROWS: { DEFAULT: 4, MAX: 8 },
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock URL methods
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Only mock click if needed
const mockClick = vi.fn();

// Test component that integrates all the wygeneruj-izrz functionality
const IzrzFormIntegration = () => {
  const {
    control,
    handleSubmit,
    isSubmitting,
    submitMessage,
    isValid,
    selectedTemplate,
    templateLoading,
    templateError,
    choosePredefinedTemplate,
  } = useCombinedForm();

  return (
    <div>
      <h1>IZRZ Form Integration Test</h1>

      <TemplateSelector
        onTemplateSelect={(file) => choosePredefinedTemplate(file.name)}
        selectedTemplate={selectedTemplate}
        loading={templateLoading}
        error={templateError}
      />

      <form onSubmit={handleSubmit}>
        <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} required />

        <FormField name="reportNumber" type="text" label="Numer raportu" control={control} required />

        <FormField name="programName" type="text" label="Nazwa programu" control={control} required />

        <FormField name="taskType" type="text" label="Typ zadania" control={control} required />

        <FormField name="address" type="text" label="Adres" control={control} required />

        <FormField name="dateInput" type="date" label="Data" control={control} required />

        <FormField name="viewerCount" type="number" label="Liczba widzów" control={control} required />

        <FormField name="viewerCountDescription" type="textarea" label="Opis liczby widzów" control={control} required />

        <FormField name="taskDescription" type="textarea" label="Opis zadania" control={control} required />

        <FormField name="attendanceList" type="checkbox" label="Lista obecności" control={control} />

        <FormField name="rozdzielnik" type="checkbox" label="Rozdzielnik" control={control} />

        <button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Generowanie..." : "Generuj raport"}
        </button>
      </form>

      {submitMessage && <div className={`message ${submitMessage.type}`}>{submitMessage.text}</div>}
    </div>
  );
};

describe("IZRZ Form Integration", () => {
  let mockFile: File;

  beforeEach(() => {
    mockFile = new File(["content"], "test.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    mockCreateObjectURL.mockReturnValue("blob:mock-url");
    // If needed, mock document.createElement for specific cases, but do not override globally
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("complete form workflow", () => {
    it("should handle complete form submission flow", async () => {
      const mockTemplateBlob = new Blob(["template content"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const mockReportBlob = new Blob(["report content"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Mock all fetch calls - handle template being called multiple times
      mockFetch.mockImplementation((url: string) => {
        if (url.includes("/generate-templates/")) {
          // Template loading - can be called multiple times
          return Promise.resolve({
            ok: true,
            blob: () => Promise.resolve(mockTemplateBlob),
          });
        } else if (url.includes("/api/generate-izrz")) {
          // Report generation
          return Promise.resolve({
            ok: true,
            headers: {
              get: vi.fn().mockReturnValue('attachment; filename="generated-report.docx"'),
            },
            blob: () => Promise.resolve(mockReportBlob),
          });
        } else {
          return Promise.reject(new Error(`Unexpected fetch call to: ${url}`));
        }
      });

      mockCreateObjectURL.mockReturnValue("blob:mock-url");

      render(<IzrzFormIntegration />, { container: document.body });

      // Select template first
      const templateButton = screen.getByText("IZRZ Template");
      await act(async () => {
        fireEvent.click(templateButton);
      });

      // Wait for template to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/generate-templates/izrz.docx");
      });

      // Wait for template to be loaded (check for success indicator)
      await waitFor(() => {
        const successIcon = screen.queryByTestId("CheckCircleIcon");
        expect(successIcon).toBeInTheDocument();
      });

      // Fill out the form
      await act(async () => {
        fireEvent.change(screen.getByRole("textbox", { name: /numer sprawy/i }), { target: { value: "123/2024" } });
        fireEvent.change(screen.getByRole("textbox", { name: /numer raportu/i }), { target: { value: "RAP-001" } });
        fireEvent.change(screen.getByRole("textbox", { name: /nazwa programu/i }), { target: { value: "Program Edukacyjny" } });
        fireEvent.change(screen.getByRole("textbox", { name: /typ zadania/i }), { target: { value: "Prelekcja" } });
        fireEvent.change(screen.getByRole("textbox", { name: /adres/i }), { target: { value: "Szkoła Podstawowa nr 1" } });
        const dateInput = document.querySelector('input[name="dateInput"]');
        if (dateInput) fireEvent.change(dateInput, { target: { value: "2024-01-15" } });
        fireEvent.change(screen.getByRole("spinbutton", { name: /liczba widzów/i }), { target: { value: "25" } });
        fireEvent.change(screen.getByRole("textbox", { name: /opis liczby widzów/i }), { target: { value: "25 uczniów klasy VII" } });
        fireEvent.change(screen.getByRole("textbox", { name: /opis zadania/i }), { target: { value: "Prelekcja o zdrowiu" } });
      });

      // Submit form
      const submitButton = screen.getByText("Generuj raport");
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Wait for form submission
      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalledWith("/api/generate-izrz", {
            method: "POST",
            body: expect.any(FormData),
          });
        },
        { timeout: 3000 }
      );

      // Verify file download was triggered
      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalled();
      });

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText("Raport został wygenerowany! Pobieranie rozpoczęte.")).toBeInTheDocument();
      });
    });

    it("should handle form validation errors", async () => {
      render(<IzrzFormIntegration />, { container: document.body });

      // Try to submit empty form
      const submitButton = screen.getByText("Generuj raport");
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Form should not be valid
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it("should handle template loading errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Template not found"));

      render(<IzrzFormIntegration />, { container: document.body });

      const templateButton = screen.getByText("IZRZ Template");
      await act(async () => {
        fireEvent.click(templateButton);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/generate-templates/izrz.docx");
      });

      // Error should be displayed
      await waitFor(() => {
        expect(screen.getByText(/template not found/i)).toBeInTheDocument();
      });
    });

    it("should handle form submission errors", async () => {
      const mockTemplateBlob = new Blob(["template content"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Mock fetch calls
      mockFetch.mockImplementation((url: string) => {
        if (url.includes("/generate-templates/")) {
          // Template loading - successful
          return Promise.resolve({
            ok: true,
            blob: () => Promise.resolve(mockTemplateBlob),
          });
        } else if (url.includes("/api/generate-izrz")) {
          // Report generation - failed
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            text: () => Promise.resolve("Server Error"),
          });
        } else {
          return Promise.reject(new Error(`Unexpected fetch call to: ${url}`));
        }
      });

      render(<IzrzFormIntegration />, { container: document.body });

      // Select template first
      const templateButton = screen.getByText("IZRZ Template");
      await act(async () => {
        fireEvent.click(templateButton);
      });

      // Wait for template to load
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/generate-templates/izrz.docx");
      });

      // Wait for template success indicator
      await waitFor(() => {
        const successIcon = screen.queryByTestId("CheckCircleIcon");
        expect(successIcon).toBeInTheDocument();
      });

      // Fill out required fields
      await act(async () => {
        fireEvent.change(screen.getByRole("textbox", { name: /numer sprawy/i }), { target: { value: "123/2024" } });
        fireEvent.change(screen.getByRole("textbox", { name: /numer raportu/i }), { target: { value: "RAP-001" } });
        fireEvent.change(screen.getByRole("textbox", { name: /nazwa programu/i }), { target: { value: "Program" } });
        fireEvent.change(screen.getByRole("textbox", { name: /typ zadania/i }), { target: { value: "Prelekcja" } });
        fireEvent.change(screen.getByRole("textbox", { name: /adres/i }), { target: { value: "Szkoła" } });
        const dateInput = document.querySelector('input[name="dateInput"]');
        if (dateInput) fireEvent.change(dateInput, { target: { value: "2024-01-15" } });
        fireEvent.change(screen.getByRole("spinbutton", { name: /liczba widzów/i }), { target: { value: "25" } });
        fireEvent.change(screen.getByRole("textbox", { name: /opis liczby widzów/i }), { target: { value: "25 uczniów" } });
        fireEvent.change(screen.getByRole("textbox", { name: /opis zadania/i }), { target: { value: "Opis" } });
      });

      // Submit form
      const submitButton = screen.getByText("Generuj raport");
      await act(async () => {
        fireEvent.click(submitButton);
      });

      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalledWith("/api/generate-izrz", {
            method: "POST",
            body: expect.any(FormData),
          });
        },
        { timeout: 3000 }
      );

      // Error should be displayed (check for error message)
      await waitFor(() => {
        expect(screen.getByText(/HTTP 500.*Server Error/i)).toBeInTheDocument();
      });
    });
  });

  describe("schema validation integration", () => {
    it("should validate complete form data", () => {
      const validData: IzrzFormData = {
        templateFile: mockFile,
        caseNumber: "123/2024",
        reportNumber: "RAP-001",
        programName: "Program Edukacyjny",
        taskType: "Prelekcja",
        address: "Szkoła Podstawowa nr 1",
        dateInput: "2024-01-15",
        viewerCount: 25,
        viewerCountDescription: "25 uczniów klasy VII",
        taskDescription: "Prelekcja o zdrowiu",
        additionalInfo: "Dodatkowe informacje",
        attendanceList: true,
        rozdzielnik: false,
      };

      const result = izrzFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid form data", () => {
      const invalidData = {
        templateFile: mockFile,
        caseNumber: "", // Empty required field
        reportNumber: "RAP-001",
        programName: "Program Edukacyjny",
        taskType: "Prelekcja",
        address: "Szkoła Podstawowa nr 1",
        dateInput: "2024-01-15",
        viewerCount: 0, // Invalid viewer count
        viewerCountDescription: "25 uczniów klasy VII",
        taskDescription: "Prelekcja o zdrowiu",
      };

      const result = izrzFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("utility functions integration", () => {
    it("should format file sizes correctly", () => {
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1024 * 1024)).toBe("1 MB");
    });

    it("should validate template files", () => {
      const validFile = new File(["content"], "test.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // size: 1024, // Removed invalid property
      });

      const invalidFile = new File(["content"], "test.txt", {
        type: "text/plain",
        // size: 1024, // Removed invalid property
      });

      expect(isValidTemplateFile(validFile)).toBe(true);
      expect(isValidTemplateFile(invalidFile)).toBe(false);
    });
  });

  describe("component integration", () => {
    it("should render all form fields", () => {
      render(<IzrzFormIntegration />, { container: document.body });

      expect(screen.getByRole("textbox", { name: /numer sprawy/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /numer raportu/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /nazwa programu/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /typ zadania/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /adres/i })).toBeInTheDocument();
      expect(document.querySelector('input[name="dateInput"]')).toBeInTheDocument();
      expect(screen.getByRole("spinbutton", { name: /liczba widzów/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /opis liczby widzów/i })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /opis zadania/i })).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: /lista obecności/i })).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: /rozdzielnik/i })).toBeInTheDocument();
    });

    it("should render template selector", () => {
      render(<IzrzFormIntegration />, { container: document.body });

      expect(screen.getByText("Wybierz szablon")).toBeInTheDocument();
      expect(screen.getByText("IZRZ Template")).toBeInTheDocument();
    });

    it("should handle form field interactions", async () => {
      render(<IzrzFormIntegration />, { container: document.body });

      const caseNumberInput = screen.getByRole("textbox", { name: /numer sprawy/i });
      fireEvent.change(caseNumberInput, { target: { value: "123/2024" } });

      await waitFor(() => {
        expect(caseNumberInput).toHaveValue("123/2024");
      });

      const attendanceCheckbox = screen.getByRole("checkbox", { name: /lista obecności/i });
      fireEvent.click(attendanceCheckbox);

      await waitFor(() => {
        expect(attendanceCheckbox).toBeChecked();
      });
    });
  });

  describe("error handling integration", () => {
    it("should handle network errors gracefully", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      render(<IzrzFormIntegration />, { container: document.body });

      const templateButton = screen.getByText("IZRZ Template");
      fireEvent.click(templateButton);

      // Should not crash the application
      expect(screen.getByText("IZRZ Template")).toBeInTheDocument();
    });

    it("should handle invalid file types", () => {
      const invalidFile = new File(["content"], "test.txt", {
        type: "text/plain",
        // size: 1024, // Removed invalid property
      });

      expect(isValidTemplateFile(invalidFile)).toBe(false);
    });

    it("should handle oversized files", () => {
      const oversizedFile = new File(["a".repeat(11 * 1024 * 1024)], "large.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      expect(isValidTemplateFile(oversizedFile)).toBe(false);
    });
  });
});
