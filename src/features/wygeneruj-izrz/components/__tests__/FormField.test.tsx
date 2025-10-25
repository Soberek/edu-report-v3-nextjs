import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { FormField } from "../FormField";
import { useForm, Control, FormProvider } from "react-hook-form";
import type { IzrzFormData } from "../../schemas/izrzSchemas";
import type { SelectOption } from "../../types";

// Mock the constants
vi.mock("../../constants", () => ({
  STYLE_CONSTANTS: {
    BORDER_RADIUS: {
      SMALL: 1.5,
    },
    FONT_SIZES: {
      SMALL: "0.8rem",
      MEDIUM: "0.9rem",
    },
  },
  FORM_CONSTANTS: {
    TEXTAREA_ROWS: {
      DEFAULT: 4,
      MAX: 8,
    },
  },
}));

// Test wrapper component that provides form context
const TestWrapper = ({ children, defaultValues }: { children: (control: Control<IzrzFormData>) => React.ReactNode; defaultValues?: Partial<IzrzFormData> }) => {
  const form = useForm<IzrzFormData>({
    defaultValues: {
      caseNumber: "",
      reportNumber: "",
      programName: "",
      taskType: "",
      address: "",
      dateInput: "",
      viewerCount: 0,
      viewerCountDescription: "",
      taskDescription: "",
      additionalInfo: "",
      attendanceList: false,
      rozdzielnik: false,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...form}>
      <form>{children(form.control)}</form>
    </FormProvider>
  );
};

describe("FormField", () => {
  describe("text field", () => {
    it("should render text field correctly", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField
            name="caseNumber"
            type="text"
            label="Numer sprawy"
            placeholder="Wprowadź numer sprawy"
            control={control}
          />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText(/Numer sprawy\s*\*?$/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Wprowadź numer sprawy")).toBeInTheDocument();
    });

    it("should handle text input changes", async () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} />
          )}
        </TestWrapper>
      );

      const input = screen.getByLabelText(/Numer sprawy\s*\*?$/);
      fireEvent.change(input, { target: { value: "123/2024" } });

      await waitFor(() => {
        expect(input).toHaveValue("123/2024");
      });
    });

    it("should show error message when error is provided", () => {
      const error = { type: "manual" as const, message: "Numer sprawy jest wymagany" };

      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} error={error} />
          )}
        </TestWrapper>
      );

      expect(screen.getByText("Numer sprawy jest wymagany")).toBeInTheDocument();
    });

    it("should show required indicator when required", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} required />
          )}
        </TestWrapper>
      );

      const input = screen.getByLabelText(/Numer sprawy\s*\*?$/);
      expect(input).toBeRequired();
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} disabled />
          )}
        </TestWrapper>
      );

      const input = screen.getByLabelText("Numer sprawy");
      expect(input).toBeDisabled();
    });
  });

  describe("number field", () => {
    it("should render number field correctly", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="viewerCount" type="number" label="Liczba widzów" control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText(/Liczba widzów\s*\*?$/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Liczba widzów\s*\*?$/)).toHaveAttribute("type", "number");
    });

    it("should handle number input changes", async () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="viewerCount" type="number" label="Liczba widzów" control={control} />
          )}
        </TestWrapper>
      );

      const input = screen.getByLabelText(/Liczba widzów\s*\*?$/);
      fireEvent.change(input, { target: { value: "25" } });

      await waitFor(() => {
        expect(input).toHaveValue(25);
      });
    });

    it("should handle empty number input", async () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="viewerCount" type="number" label="Liczba widzów" control={control} />
          )}
        </TestWrapper>
      );

      const input = screen.getByLabelText("Liczba widzów");
      fireEvent.change(input, { target: { value: "" } });

      await waitFor(() => {
        expect(input).toHaveValue(0);
      });
    });
  });

  describe("date field", () => {
    it("should render date field correctly", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="dateInput" type="date" label="Data" control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText("Data")).toBeInTheDocument();
      expect(screen.getByLabelText("Data")).toHaveAttribute("type", "date");
    });

    it("should handle date input changes", async () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="dateInput" type="date" label="Data" control={control} />
          )}
        </TestWrapper>
      );

      const input = screen.getByLabelText("Data");
      fireEvent.change(input, { target: { value: "2024-01-15" } });

      await waitFor(() => {
        expect(input).toHaveValue("2024-01-15");
      });
    });
  });

  describe("textarea field", () => {
    it("should render textarea field correctly", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="taskDescription" type="textarea" label="Opis zadania" multiline control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText("Opis zadania")).toBeInTheDocument();
    });

    it("should handle textarea input changes", async () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="taskDescription" type="textarea" label="Opis zadania" multiline control={control} />
          )}
        </TestWrapper>
      );

      const textarea = screen.getByLabelText("Opis zadania");
      fireEvent.change(textarea, { target: { value: "Długi opis zadania" } });

      await waitFor(() => {
        expect(textarea).toHaveValue("Długi opis zadania");
      });
    });

    it("should use custom minRows and maxRows", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField
            name="taskDescription"
            type="textarea"
            label="Opis zadania"
            multiline
            minRows={5}
            maxRows={10}
            control={control}
          />
          )}
        </TestWrapper>
      );

      const textarea = screen.getByLabelText("Opis zadania");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });
  });

  describe("select field", () => {
    const mockOptions: SelectOption[] = [
      { value: "prelekcja", label: "Prelekcja" },
      { value: "warsztat", label: "Warsztat" },
      { value: "konferencja", label: "Konferencja" },
    ];

    it("should render select field correctly", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="taskType" type="select" label="Typ zadania" options={mockOptions} control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText("Typ zadania")).toBeInTheDocument();
    });

    it("should handle select field changes", async () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="taskType" type="select" label="Typ zadania" options={mockOptions} control={control} />
          )}
        </TestWrapper>
      );

      const autocomplete = screen.getByLabelText("Typ zadania");

      // Type into the autocomplete to trigger options
      fireEvent.change(autocomplete, { target: { value: "Pre" } });

      // Wait for options to appear
      await waitFor(() => {
        const option = screen.getByText("Prelekcja");
        expect(option).toBeInTheDocument();
      });

      // Click the option
      const option = screen.getByText("Prelekcja");
      fireEvent.click(option);

      // Verify the autocomplete now shows the selected value
      await waitFor(() => {
        expect(autocomplete).toHaveValue("Prelekcja");
      });
    });

    it("should show error message for select field", () => {
      const error = { type: "manual" as const, message: "Typ zadania jest wymagany" };

      render(
        <TestWrapper>
          {(control) => (
            <FormField
            name="taskType"
            type="select"
            label="Typ zadania"
            options={mockOptions}
            control={control}
            error={error}
          />
          )}
        </TestWrapper>
      );

      expect(screen.getByText("Typ zadania jest wymagany")).toBeInTheDocument();
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField
            name="taskType"
            type="select"
            label="Typ zadania"
            options={mockOptions}
            control={control}
            disabled
          />
          )}
        </TestWrapper>
      );

      const select = screen.getByLabelText("Typ zadania");
      expect(select).toBeDisabled();
    });
  });

  describe("checkbox field", () => {
    it("should render checkbox field correctly", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="attendanceList" type="checkbox" label="Lista obecności" control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText("Lista obecności")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("should handle checkbox changes", async () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="attendanceList" type="checkbox" label="Lista obecności" control={control} />
          )}
        </TestWrapper>
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="attendanceList" type="checkbox" label="Lista obecności" control={control} disabled />
          )}
        </TestWrapper>
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
    });
  });

  describe("error handling", () => {
    it("should display error message when error is provided", () => {
      const error = { type: "manual" as const, message: "To pole jest wymagane" };

      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} error={error} />
          )}
        </TestWrapper>
      );

      expect(screen.getByText("To pole jest wymagane")).toBeInTheDocument();
    });

    it("should not display error message when error is not provided", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.queryByText("To pole jest wymagane")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper label association", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} />
          )}
        </TestWrapper>
      );

      const input = screen.getByLabelText(/Numer sprawy\s*\*?$/);
      expect(input).toBeInTheDocument();
    });

    it("should have proper required attribute", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} required />
          )}
        </TestWrapper>
      );

      const input = screen.getByLabelText(/Numer sprawy\s*\*?$/);
      expect(input).toBeRequired();
    });
  });

  describe("field types", () => {
    it("should render correct field type for text", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="caseNumber" type="text" label="Numer sprawy" control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText(/Numer sprawy\s*\*?$/)).toHaveAttribute("type", "text");
    });

    it("should render correct field type for number", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="viewerCount" type="number" label="Liczba widzów" control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText(/Liczba widzów\s*\*?$/)).toHaveAttribute("type", "number");
    });

    it("should render correct field type for date", () => {
      render(
        <TestWrapper>
          {(control) => (
            <FormField name="dateInput" type="date" label="Data" control={control} />
          )}
        </TestWrapper>
      );

      expect(screen.getByLabelText(/Data\s*\*?$/)).toHaveAttribute("type", "date");
    });
  });
});
