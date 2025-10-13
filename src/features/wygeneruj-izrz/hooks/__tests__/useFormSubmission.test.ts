import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useFormSubmission } from "../useFormSubmission";
import type { IzrzFormData } from "../../schemas/izrzSchemas";

// DOM environment is handled globally in vitest-setup.ts
import type { UseFormSubmissionProps } from "../../types";

// Mock the constants
vi.mock("../../constants", () => ({
  API_CONSTANTS: {
    GENERATE_IZRZ_ENDPOINT: "/api/generate-izrz",
  },
  MESSAGES: {
    ERROR: {
      GENERATION_FAILED: "Błąd podczas generowania raportu. Spróbuj ponownie.",
    },
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock click
const mockClick = vi.fn();

// Mock document.createElement to track link creation
const originalCreateElement = document.createElement.bind(document);
let capturedLink: HTMLAnchorElement | null = null;

describe("useFormSubmission", () => {
  let mockOnSuccess: ReturnType<typeof vi.fn>;
  let mockOnError: ReturnType<typeof vi.fn>;
  let mockFile: File;

  beforeEach(() => {
    mockOnSuccess = vi.fn();
    mockOnError = vi.fn();
    mockFile = new File(["content"], "test.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    mockCreateObjectURL.mockReturnValue("blob:mock-url");
    capturedLink = null;

    // Spy on createElement to capture the link element
    vi.spyOn(document, "createElement").mockImplementation(((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === "a") {
        capturedLink = element as HTMLAnchorElement;
        element.click = mockClick;
      }
      return element;
    }) as typeof document.createElement);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
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

  describe("initialization", () => {
    it("should initialize with handleSubmit function", () => {
      const { result } = renderHook(() => useFormSubmission());

      expect(typeof result.current.handleSubmit).toBe("function");
    });

    it("should initialize with optional callbacks", () => {
      const props: UseFormSubmissionProps = {
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      };

      const { result } = renderHook(() => useFormSubmission(props));

      expect(typeof result.current.handleSubmit).toBe("function");
    });
  });

  describe("createFormData", () => {
    it("should create FormData with all form fields", async () => {
      const { result } = renderHook(() => useFormSubmission());

      const formData = createValidFormData();

      // Mock successful response
      const mockBlob = new Blob(["content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('attachment; filename="report.docx"'),
        },
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/generate-izrz", {
        method: "POST",
        body: expect.any(FormData),
      });

      // Verify FormData was created correctly
      const callArgs = mockFetch.mock.calls[0];
      const formDataArg = callArgs[1].body as FormData;

      expect(formDataArg.get("templateFile")).toBe(mockFile);
      expect(formDataArg.get("caseNumber")).toBe("123/2024");
      expect(formDataArg.get("reportNumber")).toBe("RAP-001");
      expect(formDataArg.get("programName")).toBe("Program Edukacyjny");
      expect(formDataArg.get("taskType")).toBe("Prelekcja");
      expect(formDataArg.get("address")).toBe("Szkoła Podstawowa nr 1");
      expect(formDataArg.get("dateInput")).toBe("2024-01-15");
      expect(formDataArg.get("viewerCount")).toBe("25");
      expect(formDataArg.get("viewerCountDescription")).toBe("25 uczniów klasy VII");
      expect(formDataArg.get("taskDescription")).toBe("Prelekcja o zdrowiu");
      expect(formDataArg.get("additionalInfo")).toBe("Dodatkowe informacje");
      expect(formDataArg.get("attendanceList")).toBe("true");
      expect(formDataArg.get("rozdzielnik")).toBe("false");
    });

    it("should handle null and undefined values", async () => {
      const { result } = renderHook(() => useFormSubmission());

      const formDataWithNulls: IzrzFormData = {
        templateFile: mockFile,
        caseNumber: "123/2024",
        reportNumber: "RAP-001",
        programName: "Program",
        taskType: "Prelekcja",
        address: "Szkoła",
        dateInput: "2024-01-15",
        viewerCount: 25,
        viewerCountDescription: "25 uczniów",
        taskDescription: "Opis",
        additionalInfo: undefined,
        attendanceList: undefined,
        rozdzielnik: undefined,
      };

      const mockBlob = new Blob(["content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('attachment; filename="report.docx"'),
        },
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.handleSubmit(formDataWithNulls);
      });

      const callArgs = mockFetch.mock.calls[0];
      const formDataArg = callArgs[1].body as FormData;

      // Undefined values should not be included
      expect(formDataArg.has("additionalInfo")).toBe(false);
      expect(formDataArg.has("attendanceList")).toBe(false);
      expect(formDataArg.has("rozdzielnik")).toBe(false);
    });
  });

  describe("successful submission", () => {
    it("should handle successful form submission", async () => {
      const { result } = renderHook(() => useFormSubmission({ onSuccess: mockOnSuccess }));

      const formData = createValidFormData();
      const mockBlob = new Blob(["content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('attachment; filename="generated-report.docx"'),
        },
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      expect(mockOnSuccess).toHaveBeenCalledWith("generated-report.docx");
      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(capturedLink).not.toBeNull();
      expect(capturedLink!.href).toBe("blob:mock-url");
      expect(capturedLink!.download).toBe("generated-report.docx");
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should use default filename when Content-Disposition header is missing", async () => {
      const { result } = renderHook(() => useFormSubmission());

      const formData = createValidFormData();
      const mockBlob = new Blob(["content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      expect(capturedLink).not.toBeNull();
      expect(capturedLink!.download).toBe("report.docx");
    });

    it("should handle Content-Disposition header without filename", async () => {
      const { result } = renderHook(() => useFormSubmission());

      const formData = createValidFormData();
      const mockBlob = new Blob(["content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue("attachment"),
        },
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      expect(capturedLink).not.toBeNull();
      expect(capturedLink!.download).toBe("report.docx");
    });
  });

  describe("error handling", () => {
    it("should handle HTTP error responses", async () => {
      const { result } = renderHook(() => useFormSubmission({ onError: mockOnError }));

      const formData = createValidFormData();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve("Bad Request"),
      });

      await act(async () => {
        await expect(result.current.handleSubmit(formData)).rejects.toThrow("HTTP 400: Bad Request");
      });

      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle network errors", async () => {
      const { result } = renderHook(() => useFormSubmission({ onError: mockOnError }));

      const formData = createValidFormData();
      const networkError = new Error("Network error");

      mockFetch.mockRejectedValueOnce(networkError);

      await act(async () => {
        await expect(result.current.handleSubmit(formData)).rejects.toThrow("Network error");
      });

      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle unknown errors", async () => {
      const { result } = renderHook(() => useFormSubmission({ onError: mockOnError }));

      const formData = createValidFormData();

      mockFetch.mockRejectedValueOnce("Unknown error");

      await act(async () => {
        await expect(result.current.handleSubmit(formData)).rejects.toThrow();
      });

      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle blob creation errors", async () => {
      const { result } = renderHook(() => useFormSubmission({ onError: mockOnError }));

      const formData = createValidFormData();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('attachment; filename="report.docx"'),
        },
        blob: () => Promise.reject(new Error("Blob error")),
      });

      await act(async () => {
        await expect(result.current.handleSubmit(formData)).rejects.toThrow("Blob error");
      });

      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("file download", () => {
    it("should create download link with correct properties", async () => {
      const { result } = renderHook(() => useFormSubmission());

      const formData = createValidFormData();
      const mockBlob = new Blob(["content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('attachment; filename="test-report.docx"'),
        },
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      expect(capturedLink).not.toBeNull();
      expect(capturedLink!.href).toBe("blob:mock-url");
      expect(capturedLink!.download).toBe("test-report.docx");
      expect(capturedLink!.style.display).toBe("none");
    });

    it("should clean up object URL after download", async () => {
      const { result } = renderHook(() => useFormSubmission());

      const formData = createValidFormData();
      const mockBlob = new Blob(["content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('attachment; filename="report.docx"'),
        },
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
  });

  describe("console logging", () => {
    it("should log FormData entries to console", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const { result } = renderHook(() => useFormSubmission());

      const formData = createValidFormData();
      const mockBlob = new Blob(["content"], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn().mockReturnValue('attachment; filename="report.docx"'),
        },
        blob: () => Promise.resolve(mockBlob),
      });

      await act(async () => {
        await result.current.handleSubmit(formData);
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("memoization", () => {
    it("should maintain stable function references", () => {
      const { result, rerender } = renderHook(() => useFormSubmission());

      const initialHandleSubmit = result.current.handleSubmit;

      rerender();

      expect(result.current.handleSubmit).toBe(initialHandleSubmit);
    });

    it("should update function references when callbacks change", () => {
      const { result, rerender } = renderHook(({ onSuccess, onError }) => useFormSubmission({ onSuccess, onError }), {
        initialProps: { onSuccess: mockOnSuccess, onError: mockOnError },
      });

      const initialHandleSubmit = result.current.handleSubmit;

      const newMockOnSuccess = vi.fn();
      const newMockOnError = vi.fn();

      rerender({ onSuccess: newMockOnSuccess, onError: newMockOnError });

      expect(result.current.handleSubmit).not.toBe(initialHandleSubmit);
    });
  });
});
