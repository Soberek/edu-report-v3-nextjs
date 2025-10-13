import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useIzrzForm } from "../useIzrzForm";
import type { IzrzFormData } from "../../schemas/izrzSchemas";

// Mock the constants
vi.mock("../../constants", () => ({
  UI_CONSTANTS: {
    SUBMIT_MESSAGE_DURATION: 100,
  },
  MESSAGES: {
    SUCCESS: {
      REPORT_GENERATED: "Raport został wygenerowany! Pobieranie rozpoczęte.",
    },
    ERROR: {
      GENERATION_FAILED: "Błąd podczas generowania raportu. Spróbuj ponownie.",
    },
  },
}));

describe("useIzrzForm", () => {
  let mockOnSubmit: ReturnType<typeof vi.fn>;
  let mockFile: File;

  beforeEach(() => {
    mockOnSubmit = vi.fn();
    mockFile = new File(["content"], "test.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const createValidFormData = (): IzrzFormData => ({
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
  });

  // Helper to populate form with valid data
  const populateForm = (
    result: ReturnType<typeof renderHook<ReturnType<typeof useIzrzForm>, unknown>>["result"],
    formData: IzrzFormData
  ) => {
    Object.entries(formData).forEach(([key, value]) => {
      result.current.setValue(key as keyof IzrzFormData, value);
    });
  };

  // Helper to submit form
  const submitForm = async (result: ReturnType<typeof renderHook<ReturnType<typeof useIzrzForm>, unknown>>["result"]) => {
    const submitEvent = { preventDefault: () => {} } as React.FormEvent;
    await result.current.handleSubmit(submitEvent);
  };

  describe("initialization", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.submitMessage).toBe(null);
      expect(result.current.isValid).toBe(false);
      expect(result.current.hasErrors).toBe(false);
      expect(result.current.errorCount).toBe(0);
      expect(result.current.isDirty).toBe(false);
      expect(typeof result.current.handleSubmit).toBe("function");
      expect(typeof result.current.setValue).toBe("function");
      expect(typeof result.current.watch).toBe("function");
      expect(typeof result.current.reset).toBe("function");
    });

    it("should initialize with custom default values", () => {
      const defaultValues = {
        caseNumber: "custom-case",
        programName: "Custom Program",
      };

      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit, defaultValues }));

      expect(result.current.watch("caseNumber")).toBe("custom-case");
      expect(result.current.watch("programName")).toBe("Custom Program");
    });
  });

  describe("form submission", () => {
    it("should handle successful form submission", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));
      const formData = createValidFormData();

      act(() => {
        populateForm(result, formData);
      });

      await act(async () => {
        await submitForm(result);
      });

      expect(mockOnSubmit).toHaveBeenCalledWith(formData);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.submitMessage).toEqual({
        type: "success",
        text: "Raport został wygenerowany! Pobieranie rozpoczęte.",
      });
    });

    it("should handle form submission error", async () => {
      const errorMessage = "Network error";
      mockOnSubmit.mockRejectedValue(new Error(errorMessage));
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));
      const formData = createValidFormData();

      act(() => {
        populateForm(result, formData);
      });

      await act(async () => {
        await submitForm(result);
      });

      expect(mockOnSubmit).toHaveBeenCalled();
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.submitMessage).toEqual({
        type: "error",
        text: errorMessage,
      });
    });

    it("should handle form submission with unknown error", async () => {
      mockOnSubmit.mockRejectedValue("Unknown error");
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));
      const formData = createValidFormData();

      act(() => {
        populateForm(result, formData);
      });

      await act(async () => {
        await submitForm(result);
      });

      expect(result.current.submitMessage).toEqual({
        type: "error",
        text: "Błąd podczas generowania raportu. Spróbuj ponownie.",
      });
    });

    it("should set loading state during submission", async () => {
      let resolveSubmit: ((value: void) => void) | null = null;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));
      const formData = createValidFormData();

      act(() => {
        populateForm(result, formData);
      });

      // Start submission without awaiting
      act(() => {
        const submitEvent = { preventDefault: () => {} } as React.FormEvent;
        result.current.handleSubmit(submitEvent);
      });

      // Wait for isSubmitting to become true
      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });

      // Resolve the promise
      await act(async () => {
        resolveSubmit!(undefined);
        await submitPromise;
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("submit message auto-dismiss", () => {
    it("should auto-dismiss success message after timeout", async () => {
      vi.useFakeTimers();
      mockOnSubmit.mockResolvedValue(undefined);
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));
      const formData = createValidFormData();

      act(() => {
        populateForm(result, formData);
      });

      await act(async () => {
        await submitForm(result);
      });

      expect(result.current.submitMessage).not.toBe(null);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.submitMessage).toBe(null);

      vi.useRealTimers();
    });

    it("should auto-dismiss error message after timeout", async () => {
      vi.useFakeTimers();
      mockOnSubmit.mockRejectedValue(new Error("Test error"));
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));
      const formData = createValidFormData();

      act(() => {
        populateForm(result, formData);
      });

      await act(async () => {
        await submitForm(result);
      });

      expect(result.current.submitMessage).not.toBe(null);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.submitMessage).toBe(null);

      vi.useRealTimers();
    });

    it("should clear timeout when new message is set", async () => {
      vi.useFakeTimers();
      mockOnSubmit.mockResolvedValue(undefined);
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));
      const formData = createValidFormData();

      act(() => {
        populateForm(result, formData);
      });

      // First submission
      await act(async () => {
        await submitForm(result);
      });

      // Second submission before timeout
      await act(async () => {
        await submitForm(result);
      });

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.submitMessage).toBe(null);

      vi.useRealTimers();
    });
  });

  describe("form value management", () => {
    it("should set form value with validation", () => {
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));

      act(() => {
        result.current.setValue("caseNumber", "123/2024");
      });

      expect(result.current.watch("caseNumber")).toBe("123/2024");
      expect(result.current.isDirty).toBe(true);
    });

    it("should reset form and clear submit message", () => {
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));

      act(() => {
        result.current.setValue("caseNumber", "123/2024");
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.watch("caseNumber")).toBe("");
      expect(result.current.isDirty).toBe(false);
      expect(result.current.submitMessage).toBe(null);
    });
  });

  describe("validation state", () => {
    it("should track validation state correctly", () => {
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));

      expect(result.current.isValid).toBe(false);
      expect(result.current.hasErrors).toBe(false);

      const formData = createValidFormData();
      act(() => {
        populateForm(result, formData);
      });

      // Need to wait for validation
      waitFor(() => {
        expect(result.current.isValid).toBe(true);
        expect(result.current.hasErrors).toBe(false);
        expect(result.current.errorCount).toBe(0);
      });
    });

    it("should track dirty state", () => {
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));

      expect(result.current.isDirty).toBe(false);

      act(() => {
        result.current.setValue("caseNumber", "123/2024");
      });

      expect(result.current.isDirty).toBe(true);
    });
  });

  describe("memoization", () => {
    it("should maintain stable function references", () => {
      const { result, rerender } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));

      const initialHandleSubmit = result.current.handleSubmit;
      const initialSetValue = result.current.setValue;
      const initialWatch = result.current.watch;
      const initialReset = result.current.reset;

      rerender();

      // These should maintain references (note: handleSubmit might change due to RHF)
      expect(result.current.setValue).toBe(initialSetValue);
      expect(result.current.watch).toBe(initialWatch);
      expect(result.current.reset).toBe(initialReset);
    });

    it("should update function references when onSubmit changes", () => {
      const newOnSubmit = vi.fn();
      const { result, rerender } = renderHook(({ onSubmit }) => useIzrzForm({ onSubmit }), { initialProps: { onSubmit: mockOnSubmit } });

      const initialHandleSubmit = result.current.handleSubmit;

      rerender({ onSubmit: newOnSubmit });

      // handleSubmit should update when onSubmit changes
      expect(result.current.handleSubmit).not.toBe(initialHandleSubmit);
    });
  });

  describe("error handling", () => {
    it("should handle submission errors gracefully", async () => {
      mockOnSubmit.mockRejectedValue(new Error("Test error"));
      const { result } = renderHook(() => useIzrzForm({ onSubmit: mockOnSubmit }));
      const formData = createValidFormData();

      act(() => {
        populateForm(result, formData);
      });

      await act(async () => {
        await submitForm(result);
      });

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.submitMessage).toEqual({
        type: "error",
        text: "Test error",
      });
    });
  });
});
