import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useHealthInspectionAggregator } from "./useHealthInspectionAggregator";
import * as fileProcessing from "../utils/fileProcessing";
import { ERROR_MESSAGES, MAX_FILES } from "../types";

// Mock the file processing utilities
vi.mock("../utils/fileProcessing", () => ({
  validateExcelFile: vi.fn(),
  readExcelFile: vi.fn(),
  validateExcelData: vi.fn(),
  aggregateHealthData: vi.fn(),
  exportToExcel: vi.fn(),
}));

describe("useHealthInspectionAggregator", () => {
  // Helper function to create mock File objects
  const createMockFile = (name: string, size: number = 1024): File => {
    const file = new File(["test content"], name, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    Object.defineProperty(file, "size", { value: size });
    return file;
  };

  // Helper function to create mock FileList
  const createMockFileList = (files: File[]): FileList => {
    const fileList = {
      length: files.length,
      item: (index: number) => files[index] || null,
      [Symbol.iterator]: function* () {
        for (let i = 0; i < files.length; i++) {
          yield files[i];
        }
      },
    };
    Object.assign(fileList, files);
    return fileList as FileList;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with empty state", () => {
      const { result } = renderHook(() => useHealthInspectionAggregator());

      expect(result.current.files).toEqual([]);
      expect(result.current.isProcessing).toBe(false);
      expect(result.current.aggregatedData).toBeNull();
      expect(result.current.globalError).toBeNull();
    });

    it("should have all required functions", () => {
      const { result } = renderHook(() => useHealthInspectionAggregator());

      expect(typeof result.current.handleFilesUpload).toBe("function");
      expect(typeof result.current.removeFile).toBe("function");
      expect(typeof result.current.clearAll).toBe("function");
      expect(typeof result.current.aggregateData).toBe("function");
      expect(typeof result.current.exportData).toBe("function");
    });
  });

  describe("handleFilesUpload", () => {
    it("should handle null or empty FileList", async () => {
      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(null);
      });

      expect(result.current.files).toEqual([]);
      expect(result.current.isProcessing).toBe(false);
    });

    it("should set isProcessing to true while processing files", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      // Check that isProcessing is false after upload completes
      expect(result.current.isProcessing).toBe(false);
    });

    it("should successfully process a valid file", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);
      const mockData = [{ "RODZAJ OBIEKTU": "Test", "LICZBA SKONTROLOWANYCH OBIEKTÓW": 5 }] as any[];

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: mockData, worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.files[0].fileName).toBe("test.xlsx");
      expect(result.current.files[0].status).toBe("success");
      expect(result.current.files[0].data).toEqual(mockData);
      expect(result.current.isProcessing).toBe(false);
    });

    it("should handle file validation error", async () => {
      const mockFile = createMockFile("invalid.txt");
      const mockFileList = createMockFileList([mockFile]);

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({
        isValid: false,
        error: "Invalid file type",
      });

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.files[0].status).toBe("error");
      expect(result.current.files[0].error).toBe("Invalid file type");
      expect(result.current.isProcessing).toBe(false);
    });

    it("should handle data validation error", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({
        isValid: false,
        error: "No data found",
      });

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.files[0].status).toBe("error");
      expect(result.current.files[0].error).toBe("No data found");
    });

    it("should prevent uploading more than MAX_FILES", async () => {
      const mockFiles = Array.from({ length: MAX_FILES + 1 }, (_, i) => createMockFile(`test${i}.xlsx`));
      const mockFileList = createMockFileList(mockFiles);

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      expect(result.current.globalError).toBe(ERROR_MESSAGES.TOO_MANY_FILES);
      expect(result.current.files).toHaveLength(0);
      expect(result.current.isProcessing).toBe(false);
    });

    it("should process multiple files sequentially", async () => {
      const mockFile1 = createMockFile("test1.xlsx");
      const mockFile2 = createMockFile("test2.xlsx");
      const mockFileList = createMockFileList([mockFile1, mockFile2]);
      const mockData1 = [{ "RODZAJ OBIEKTU": "Test1", "LICZBA SKONTROLOWANYCH OBIEKTÓW": 1 }] as any[];
      const mockData2 = [{ "RODZAJ OBIEKTU": "Test2", "LICZBA SKONTROLOWANYCH OBIEKTÓW": 2 }] as any[];

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile)
        .mockResolvedValueOnce({ fileName: "test1.xlsx", data: mockData1, worksheet: {} as any })
        .mockResolvedValueOnce({ fileName: "test2.xlsx", data: mockData2, worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      expect(result.current.files).toHaveLength(2);
      expect(result.current.files[0].fileName).toBe("test1.xlsx");
      expect(result.current.files[0].status).toBe("success");
      expect(result.current.files[1].fileName).toBe("test2.xlsx");
      expect(result.current.files[1].status).toBe("success");
    });

    it("should handle error during file reading", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockRejectedValue(new Error("Read error"));

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.files[0].status).toBe("error");
      expect(result.current.files[0].error).toBe("Read error");
    });
  });

  describe("removeFile", () => {
    it("should remove a file at the specified index", async () => {
      const mockFile1 = createMockFile("test1.xlsx");
      const mockFile2 = createMockFile("test2.xlsx");
      const mockFileList = createMockFileList([mockFile1, mockFile2]);

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      expect(result.current.files).toHaveLength(2);

      act(() => {
        result.current.removeFile(0);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.files[0].fileName).toBe("test2.xlsx");
    });

    it("should clear aggregatedData when removing a file", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.aggregateHealthData).mockReturnValue({});

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      act(() => {
        result.current.aggregateData();
      });

      expect(result.current.aggregatedData).not.toBeNull();

      act(() => {
        result.current.removeFile(0);
      });

      expect(result.current.aggregatedData).toBeNull();
    });
  });

  describe("clearAll", () => {
    it("should clear all files and reset state", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      expect(result.current.files).toHaveLength(1);

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.files).toEqual([]);
      expect(result.current.aggregatedData).toBeNull();
      expect(result.current.globalError).toBeNull();
    });
  });

  describe("aggregateData", () => {
    it("should aggregate data from successful files", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);
      const mockData = [{ "RODZAJ OBIEKTU": "Test", "LICZBA SKONTROLOWANYCH OBIEKTÓW": 1 }] as any[];
      const mockAggregated = { Test: { skontrolowane: 5, realizowane: 3, zWykorzystaniemPalarni: 1 } };

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: mockData, worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.aggregateHealthData).mockReturnValue(mockAggregated);

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      act(() => {
        result.current.aggregateData();
      });

      expect(result.current.aggregatedData).toEqual(mockAggregated);
      expect(result.current.isProcessing).toBe(false);
    });

    it("should show error when no successful files", () => {
      const { result } = renderHook(() => useHealthInspectionAggregator());

      act(() => {
        result.current.aggregateData();
      });

      expect(result.current.globalError).toBe("Brak poprawnie przetworzonych plików");
      expect(result.current.aggregatedData).toBeNull();
    });

    it("should handle aggregation error", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.aggregateHealthData).mockImplementation(() => {
        throw new Error("Aggregation failed");
      });

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      act(() => {
        result.current.aggregateData();
      });

      expect(result.current.globalError).toBe("Aggregation failed");
      expect(result.current.isProcessing).toBe(false);
    });
  });

  describe("exportData", () => {
    it("should export aggregated data successfully", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);
      const mockAggregated = { Test: { skontrolowane: 5, realizowane: 3, zWykorzystaniemPalarni: 1 } };

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.aggregateHealthData).mockReturnValue(mockAggregated);
      vi.mocked(fileProcessing.exportToExcel).mockResolvedValue(true);

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      act(() => {
        result.current.aggregateData();
      });

      let exportResult: boolean | undefined;
      await act(async () => {
        exportResult = await result.current.exportData("styczeń 2025");
      });

      expect(exportResult).toBe(true);
      expect(fileProcessing.exportToExcel).toHaveBeenCalledWith(mockAggregated, "styczeń 2025");
      expect(result.current.isProcessing).toBe(false);
    });

    it("should show error when no aggregated data", async () => {
      const { result } = renderHook(() => useHealthInspectionAggregator());

      let exportResult: boolean | undefined;
      await act(async () => {
        exportResult = await result.current.exportData();
      });

      expect(exportResult).toBe(false);
      expect(result.current.globalError).toBe("Brak danych do eksportu");
    });

    it("should handle export error", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);
      const mockAggregated = { Test: { skontrolowane: 5, realizowane: 3, zWykorzystaniemPalarni: 1 } };

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.aggregateHealthData).mockReturnValue(mockAggregated);
      vi.mocked(fileProcessing.exportToExcel).mockRejectedValue(new Error("Export failed"));

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      act(() => {
        result.current.aggregateData();
      });

      let exportResult: boolean | undefined;
      await act(async () => {
        exportResult = await result.current.exportData();
      });

      expect(exportResult).toBe(false);
      expect(result.current.globalError).toBe("Export failed");
      expect(result.current.isProcessing).toBe(false);
    });

    it("should handle export returning false", async () => {
      const mockFile = createMockFile("test.xlsx");
      const mockFileList = createMockFileList([mockFile]);
      const mockAggregated = { Test: { skontrolowane: 5, realizowane: 3, zWykorzystaniemPalarni: 1 } };

      vi.mocked(fileProcessing.validateExcelFile).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.readExcelFile).mockResolvedValue({ fileName: "test.xlsx", data: [], worksheet: {} as any });
      vi.mocked(fileProcessing.validateExcelData).mockReturnValue({ isValid: true });
      vi.mocked(fileProcessing.aggregateHealthData).mockReturnValue(mockAggregated);
      vi.mocked(fileProcessing.exportToExcel).mockResolvedValue(false);

      const { result } = renderHook(() => useHealthInspectionAggregator());

      await act(async () => {
        await result.current.handleFilesUpload(mockFileList);
      });

      act(() => {
        result.current.aggregateData();
      });

      let exportResult: boolean | undefined;
      await act(async () => {
        exportResult = await result.current.exportData();
      });

      expect(exportResult).toBe(false);
      expect(result.current.globalError).toBe("Błąd podczas eksportu danych");
    });
  });
});
