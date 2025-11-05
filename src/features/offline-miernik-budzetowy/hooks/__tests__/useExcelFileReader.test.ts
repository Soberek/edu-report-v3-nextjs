import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExcelFileReader } from "../useExcelFileReader";
import { z } from "zod";

describe("useExcelFileReader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with empty state", () => {
    const { result } = renderHook(() => useExcelFileReader());

    expect(result.current.fileName).toBe("");
    expect(result.current.rawData).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should have handleFileUpload and resetState functions", () => {
    const { result } = renderHook(() => useExcelFileReader());

    expect(result.current.handleFileUpload).toBeInstanceOf(Function);
    expect(result.current.resetState).toBeInstanceOf(Function);
  });

  it("should reset state correctly", () => {
    const { result } = renderHook(() => useExcelFileReader());

    act(() => {
      result.current.resetState();
    });

    expect(result.current.fileName).toBe("");
    expect(result.current.rawData).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle file validation - reject invalid extensions", async () => {
    const { result } = renderHook(() => useExcelFileReader());

    const invalidFile = new File(["content"], "test.txt", {
      type: "text/plain",
    });

    const input = document.createElement("input");
    input.type = "file";

    act(() => {
      Object.defineProperty(input, "files", {
        value: [invalidFile],
      });

      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", { value: input, enumerable: true });

      result.current.handleFileUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toContain("valid Excel file");
  });

  it("should handle empty file list", async () => {
    const { result } = renderHook(() => useExcelFileReader());

    const input = document.createElement("input");
    input.type = "file";

    act(() => {
      Object.defineProperty(input, "files", {
        value: [],
      });

      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", { value: input, enumerable: true });

      result.current.handleFileUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toContain("No file selected");
  });

  it("should accept custom Zod schema", () => {
    const customSchema = z.object({
      customField: z.string(),
    });

    const { result } = renderHook(() => useExcelFileReader({ schema: customSchema }));

    expect(result.current.fileName).toBe("");
  });

  it("should use default ExcelRowSchema if not provided", () => {
    const { result } = renderHook(() => useExcelFileReader());

    expect(result.current.fileName).toBe("");
    expect(result.current.isLoading).toBe(false);
  });

  it("should validate .xlsx files", () => {
    const { result } = renderHook(() => useExcelFileReader());

    const validFile = new File(["content"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const input = document.createElement("input");
    input.type = "file";

    act(() => {
      Object.defineProperty(input, "files", {
        value: [validFile],
      });

      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", { value: input, enumerable: true });

      result.current.handleFileUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    // If file is valid, error should be null (file reading happens async, but validation passes)
    expect(result.current.error === null || !result.current.error?.includes("valid Excel file")).toBe(true);
  });

  it("should validate .xls files", () => {
    const { result } = renderHook(() => useExcelFileReader());

    const validFile = new File(["content"], "test.xls", {
      type: "application/vnd.ms-excel",
    });

    const input = document.createElement("input");
    input.type = "file";

    act(() => {
      Object.defineProperty(input, "files", {
        value: [validFile],
      });

      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", { value: input, enumerable: true });

      result.current.handleFileUpload(event as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    // If file is valid, error should be null or not about extension
    expect(result.current.error === null || !result.current.error?.includes("valid Excel file")).toBe(true);
  });
});
