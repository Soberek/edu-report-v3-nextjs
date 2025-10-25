import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useTemplateManager } from "../useTemplateManager";
import type { UseTemplateManagerProps } from "../../types";

// Mock the constants
vi.mock("../../constants", () => ({
  TEMPLATE_CONSTANTS: {
    ALLOWED_FILE_TYPES: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"],
  },
  API_CONSTANTS: {
    TEMPLATE_BASE_PATH: "/generate-templates",
  },
  MESSAGES: {
    ERROR: {
      FILE_TOO_LARGE: "Plik jest zbyt duży. Maksymalny rozmiar to 10MB.",
      INVALID_FILE_TYPE: "Nieprawidłowy typ pliku. Dozwolone są tylko pliki .docx",
      TEMPLATE_LOAD_FAILED: "Błąd podczas ładowania szablonu.",
    },
  },
  UI_CONSTANTS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useTemplateManager", () => {
  let mockOnTemplateSelect: ReturnType<typeof vi.fn>;
  let validFile: File;
  let invalidFile: File;

  beforeEach(() => {
    mockOnTemplateSelect = vi.fn();
    // Create files with actual content to get proper size
    const content = "x".repeat(1024); // 1KB content
    validFile = new File([content], "test.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    invalidFile = new File([content], "test.txt", {
      type: "text/plain",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      expect(result.current.selectedTemplate).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.choosePredefinedTemplate).toBe("function");
      expect(typeof result.current.handleFileUpload).toBe("function");
      expect(typeof result.current.clearTemplate).toBe("function");
    });
  });

  describe("file validation", () => {
    it("should validate file size correctly", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      // Create a file with content that exceeds the size limit
      const largeContent = "x".repeat(11 * 1024 * 1024); // 11MB content
      const largeFile = new File([largeContent], "large.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      act(() => {
        result.current.handleFileUpload(largeFile);
      });

      expect(result.current.error).toBe("Plik jest zbyt duży. Maksymalny rozmiar to 10MB.");
      expect(result.current.selectedTemplate).toBe(null);
      expect(mockOnTemplateSelect).not.toHaveBeenCalled();
    });

    it("should validate file type correctly", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      act(() => {
        result.current.handleFileUpload(invalidFile);
      });

      expect(result.current.error).toBe("Nieprawidłowy typ pliku. Dozwolone są tylko pliki .docx");
      expect(result.current.selectedTemplate).toBe(null);
      expect(mockOnTemplateSelect).not.toHaveBeenCalled();
    });

    it("should accept valid files", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      act(() => {
        result.current.handleFileUpload(validFile);
      });

      expect(result.current.error).toBe(null);
      expect(result.current.selectedTemplate).toEqual({
        file: validFile,
        name: "test.docx",
        size: 1024,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      expect(mockOnTemplateSelect).toHaveBeenCalledWith(validFile);
    });

    it("should clear error when valid file is uploaded after invalid one", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      // Upload invalid file first
      act(() => {
        result.current.handleFileUpload(invalidFile);
      });

      expect(result.current.error).toBe("Nieprawidłowy typ pliku. Dozwolone są tylko pliki .docx");

      // Upload valid file
      act(() => {
        result.current.handleFileUpload(validFile);
      });

      expect(result.current.error).toBe(null);
      expect(result.current.selectedTemplate).not.toBe(null);
    });
  });

  describe("predefined template selection", () => {
    it("should load predefined template successfully", async () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      const mockBlob = new Blob(["template content"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.choosePredefinedTemplate("izrz.docx");
      });

      expect(mockFetch).toHaveBeenCalledWith("/generate-templates/izrz.docx");
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.selectedTemplate).not.toBe(null);
      expect(mockOnTemplateSelect).toHaveBeenCalled();
    });

    it("should handle template loading errors", async () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await act(async () => {
        await expect(result.current.choosePredefinedTemplate("nonexistent.docx")).rejects.toThrow("HTTP 404: Not Found");
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("HTTP 404: Not Found");
      expect(result.current.selectedTemplate).toBe(null);
      expect(mockOnTemplateSelect).not.toHaveBeenCalled();
    });

    it("should handle network errors during template loading", async () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      const networkError = new Error("Network error");
      mockFetch.mockRejectedValueOnce(networkError);

      await act(async () => {
        await expect(result.current.choosePredefinedTemplate("template.docx")).rejects.toThrow("Network error");
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Network error");
      expect(result.current.selectedTemplate).toBe(null);
      expect(mockOnTemplateSelect).not.toHaveBeenCalled();
    });

    it("should handle unknown errors during template loading", async () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      mockFetch.mockRejectedValueOnce("Unknown error");

      await act(async () => {
        await expect(result.current.choosePredefinedTemplate("template.docx")).rejects.toThrow();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Błąd podczas ładowania szablonu.");
      expect(result.current.selectedTemplate).toBe(null);
      expect(mockOnTemplateSelect).not.toHaveBeenCalled();
    });

    it("should set loading state during template loading", async () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      let resolveFetch: (value: unknown) => void;
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });
      mockFetch.mockReturnValue(fetchPromise);

      // Start loading
      act(() => {
        result.current.choosePredefinedTemplate("template.docx");
      });

      expect(result.current.loading).toBe(true);

      // Resolve the promise
      await act(async () => {
        resolveFetch!({
          ok: true,
          blob: () => Promise.resolve(new Blob(["content"])),
        });
        await fetchPromise;
      });

      expect(result.current.loading).toBe(false);
    });

    it("should validate downloaded template file", async () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      // Create a blob that will result in an invalid file
      const mockBlob = new Blob(["content"], { type: "text/plain" });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.choosePredefinedTemplate("template.docx");
      });

      expect(result.current.error).toBe("Nieprawidłowy typ pliku. Dozwolone są tylko pliki .docx");
      expect(result.current.selectedTemplate).toBe(null);
      expect(mockOnTemplateSelect).not.toHaveBeenCalled();
    });
  });

  describe("file upload handling", () => {
    it("should handle file upload correctly", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      act(() => {
        result.current.handleFileUpload(validFile);
      });

      expect(result.current.selectedTemplate).toEqual({
        file: validFile,
        name: "test.docx",
        size: 1024,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      expect(mockOnTemplateSelect).toHaveBeenCalledWith(validFile);
    });

    it("should clear error before processing new file", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      // Set an error first
      act(() => {
        result.current.handleFileUpload(invalidFile);
      });

      expect(result.current.error).not.toBe(null);

      // Upload valid file
      act(() => {
        result.current.handleFileUpload(validFile);
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("template clearing", () => {
    it("should clear selected template and error", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      // Set a template first
      act(() => {
        result.current.handleFileUpload(validFile);
      });

      expect(result.current.selectedTemplate).not.toBe(null);

      // Clear template
      act(() => {
        result.current.clearTemplate();
      });

      expect(result.current.selectedTemplate).toBe(null);
      expect(result.current.error).toBe(null);
    });
  });

  describe("memoization", () => {
    it("should maintain stable function references", () => {
      const { result, rerender } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      const initialChoosePredefinedTemplate = result.current.choosePredefinedTemplate;
      const initialHandleFileUpload = result.current.handleFileUpload;
      const initialClearTemplate = result.current.clearTemplate;

      rerender();

      expect(result.current.choosePredefinedTemplate).toBe(initialChoosePredefinedTemplate);
      expect(result.current.handleFileUpload).toBe(initialHandleFileUpload);
      expect(result.current.clearTemplate).toBe(initialClearTemplate);
    });

    it("should update function references when onTemplateSelect changes", () => {
      const { result, rerender } = renderHook(
        ({ onTemplateSelect }) => useTemplateManager({ onTemplateSelect }),
        {
          initialProps: { onTemplateSelect: mockOnTemplateSelect },
        }
      );

      const initialChoosePredefinedTemplate = result.current.choosePredefinedTemplate;
      const initialHandleFileUpload = result.current.handleFileUpload;

      const newMockOnTemplateSelect = vi.fn();
      rerender({ onTemplateSelect: newMockOnTemplateSelect });

      expect(result.current.choosePredefinedTemplate).not.toBe(initialChoosePredefinedTemplate);
      expect(result.current.handleFileUpload).not.toBe(initialHandleFileUpload);
    });
  });

  describe("error handling", () => {
    it("should log errors to console during template loading", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      const error = new Error("Test error");
      mockFetch.mockRejectedValueOnce(error);

      await act(async () => {
        await expect(result.current.choosePredefinedTemplate("template.docx")).rejects.toThrow("Test error");
      });

      expect(consoleError).toHaveBeenCalledWith("Error fetching template:", error);
      consoleError.mockRestore();
    });
  });

  describe("file size edge cases", () => {
    it("should accept file at exact size limit", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      const exactSizeFile = new File(["x".repeat(10 * 1024 * 1024)], "exact.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      act(() => {
        result.current.handleFileUpload(exactSizeFile);
      });

      expect(result.current.error).toBe(null);
      expect(result.current.selectedTemplate).not.toBe(null);
    });

    it("should reject file just over size limit", () => {
      const { result } = renderHook(() => useTemplateManager({ onTemplateSelect: mockOnTemplateSelect }));

      // Create a file with content that just exceeds the size limit
      const overLimitContent = "x".repeat(10 * 1024 * 1024 + 1); // Just over 10MB
      const overLimitFile = new File([overLimitContent], "over.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      act(() => {
        result.current.handleFileUpload(overLimitFile);
      });

      expect(result.current.error).toBe("Plik jest zbyt duży. Maksymalny rozmiar to 10MB.");
      expect(result.current.selectedTemplate).toBe(null);
    });
  });
});
